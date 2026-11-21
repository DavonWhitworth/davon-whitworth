"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { GeoJSONSource, Map as MapLibreMap, MapLayerMouseEvent } from "maplibre-gl";
import { CAMPUS_BOUNDS, type ProductionTree } from "@/features/csus-trees/model";
import type { UserPosition } from "@/features/csus-trees/ui/hooks";

// The campus map. MapLibre draws it in the browser from OpenFreeMap's free
// vector tiles (no API key, no cookies). Trees are clustered by zoom level.

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const CAMPUS_CENTER: [number, number] = [-121.4245, 38.5605];

// Let people pan a little past the campus box, but not across the city.
const PAN_MARGIN = 0.01;
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [CAMPUS_BOUNDS.minLng - PAN_MARGIN, CAMPUS_BOUNDS.minLat - PAN_MARGIN],
  [CAMPUS_BOUNDS.maxLng + PAN_MARGIN, CAMPUS_BOUNDS.maxLat + PAN_MARGIN],
];

// MapLibre 6 loads a separate worker script; scripts/copy-maplibre-worker.mjs
// copies it into public/vendor before `dev` and `build`.
const WORKER_PATH = "/vendor/maplibre-gl-worker.mjs";

const TREE_COLOR = "#2f6b4f";
const USER_COLOR = "#2563eb";

export type MapFocus = { lat: number; lng: number; zoom: number; key: number };

type Props = {
  trees: ProductionTree[];
  userPosition: UserPosition | null;
  /** Change this to move the map to a point (e.g. a tree that was just saved). */
  focus: MapFocus | null;
  /** Increase this to move the map to the user as soon as their location is known. */
  followUserKey: number;
  /** Content of the popup for a tapped tree. `close` closes the popup. */
  renderPopup: (treeNumber: number, close: () => void) => ReactNode;
};

/** The open popup: React renders into `container`, which MapLibre places on the map. */
type OpenPopup = { treeNumber: number; container: HTMLElement; close: () => void };

type Point = { type: "Point"; coordinates: [number, number] };
type Polygon = { type: "Polygon"; coordinates: [number, number][][] };
type Feature<G> = { type: "Feature"; geometry: G; properties: Record<string, string | number> };
type FeatureCollection<G> = { type: "FeatureCollection"; features: Feature<G>[] };

function treesToGeoJson(trees: ProductionTree[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: trees.map((tree) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [tree.lng, tree.lat] },
      properties: { n: tree.treeNumber, s: tree.speciesId ?? "", c: tree.readingCount },
    })),
  };
}

/** A circle of the given radius in metres, as a polygon (for the accuracy ring). */
function circle(lat: number, lng: number, radiusM: number, steps = 48): Polygon {
  const dLat = radiusM / 111_320;
  const dLng = radiusM / (111_320 * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    ring.push([lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)]);
  }
  return { type: "Polygon", coordinates: [ring] };
}

function userToGeoJson(position: UserPosition | null): FeatureCollection<Point | Polygon> {
  if (!position) return { type: "FeatureCollection", features: [] };
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: circle(position.lat, position.lng, position.accuracyM),
        properties: { kind: "accuracy" },
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [position.lng, position.lat] },
        properties: { kind: "dot" },
      },
    ],
  };
}

export function TreeMap({ trees, userPosition, focus, followUserKey, renderPopup }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const followedKeyRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [popup, setPopup] = useState<OpenPopup | null>(null);

  // Create the map once. MapLibre is loaded in the browser only.
  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | undefined;

    (async () => {
      const maplibre = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;

      maplibre.setWorkerUrl(`${WORKER_PATH}?v=${maplibre.getVersion()}`);
      map = new maplibre.Map({
        container: containerRef.current,
        style: STYLE_URL,
        center: CAMPUS_CENTER,
        zoom: 15.5,
        minZoom: 13,
        maxZoom: 20,
        maxBounds: MAX_BOUNDS,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");

      map.on("error", (event) => console.error("[csus-trees] map error:", event.error));

      // OpenFreeMap's style names a few point-of-interest icons (atm, gate,
      // swimming_pool...) that its own icon sheet doesn't include. Fill each one
      // with a blank transparent pixel: the map looks the same, minus the warnings.
      const blankIcon = { width: 1, height: 1, data: new Uint8Array(4) };
      map.setMissingStyleImageResolver((id) => {
        if (map && !map.hasImage(id)) map.addImage(id, blankIcon);
      });

      map.on("load", () => {
        if (!map) return;

        map.addSource("trees", {
          type: "geojson",
          data: treesToGeoJson([]),
          cluster: true,
          clusterRadius: 40,
          clusterMaxZoom: 17,
        });
        map.addLayer({
          id: "tree-clusters",
          type: "circle",
          source: "trees",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": TREE_COLOR,
            "circle-opacity": 0.85,
            "circle-radius": ["step", ["get", "point_count"], 14, 10, 18, 50, 24],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });
        map.addLayer({
          id: "tree-cluster-count",
          type: "symbol",
          source: "trees",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["Noto Sans Bold"],
            "text-size": 12,
          },
          paint: { "text-color": "#ffffff" },
        });
        map.addLayer({
          id: "tree-points",
          type: "circle",
          source: "trees",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": TREE_COLOR,
            "circle-radius": 7,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });
        map.addLayer({
          id: "tree-labels",
          type: "symbol",
          source: "trees",
          filter: ["!", ["has", "point_count"]],
          minzoom: 16,
          layout: {
            "text-field": ["to-string", ["get", "n"]],
            "text-font": ["Noto Sans Bold"],
            "text-size": 12,
            "text-offset": [0, -1.4],
            "text-allow-overlap": false,
          },
          paint: { "text-color": TREE_COLOR, "text-halo-color": "#ffffff", "text-halo-width": 1.5 },
        });

        map.addSource("me", { type: "geojson", data: userToGeoJson(null) });
        map.addLayer({
          id: "me-accuracy",
          type: "fill",
          source: "me",
          filter: ["==", ["get", "kind"], "accuracy"],
          paint: { "fill-color": USER_COLOR, "fill-opacity": 0.15 },
        });
        map.addLayer({
          id: "me-dot",
          type: "circle",
          source: "me",
          filter: ["==", ["get", "kind"], "dot"],
          paint: {
            "circle-color": USER_COLOR,
            "circle-radius": 7,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 3,
          },
        });

        // Tap a cluster to zoom in until it splits.
        map.on("click", "tree-clusters", async (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0];
          const source = map?.getSource<GeoJSONSource>("trees");
          if (!feature || !source || feature.geometry.type !== "Point") return;
          const zoom = await source.getClusterExpansionZoom(Number(feature.properties.cluster_id));
          map?.easeTo({ center: feature.geometry.coordinates as [number, number], zoom });
        });

        // Tap a tree for its details. React renders the content (see renderPopup).
        map.on("click", "tree-points", (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0];
          if (!feature || !map || feature.geometry.type !== "Point") return;
          const container = document.createElement("div");
          const instance = new maplibre.Popup({ offset: 12, maxWidth: "260px" })
            .setLngLat(feature.geometry.coordinates as [number, number])
            .setDOMContent(container)
            .addTo(map);
          instance.on("close", () => setPopup((current) => (current?.container === container ? null : current)));
          setPopup({ treeNumber: Number(feature.properties.n), container, close: () => instance.remove() });
        });

        for (const layer of ["tree-clusters", "tree-points"]) {
          map.on("mouseenter", layer, () => map && (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", layer, () => map && (map.getCanvas().style.cursor = ""));
        }

        setReady(true);
      });
    })().catch((error) => {
      console.error("[csus-trees] map failed to start:", error);
      setFailed(true);
    });

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // Keep the tree pins in sync.
  useEffect(() => {
    if (!ready) return;
    mapRef.current?.getSource<GeoJSONSource>("trees")?.setData(treesToGeoJson(trees));
  }, [ready, trees]);

  // Keep the "you are here" dot in sync, and center on it when asked.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    map?.getSource<GeoJSONSource>("me")?.setData(userToGeoJson(userPosition));
    if (map && userPosition && followUserKey !== followedKeyRef.current) {
      followedKeyRef.current = followUserKey;
      map.easeTo({ center: [userPosition.lng, userPosition.lat], zoom: Math.max(map.getZoom(), 17) });
    }
  }, [ready, userPosition, followUserKey]);

  // Move to a requested point.
  useEffect(() => {
    if (!ready || !focus) return;
    mapRef.current?.easeTo({ center: [focus.lng, focus.lat], zoom: focus.zoom });
  }, [ready, focus]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" aria-label="Map of campus trees" role="region" />
      {popup ? createPortal(renderPopup(popup.treeNumber, popup.close), popup.container) : null}
      {failed ? (
        <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-muted">
          The map couldn&apos;t load in this browser.
        </p>
      ) : null}
    </div>
  );
}
