---
title: CSUS-Trees
description: "CSUS-Trees is a crowd-sourced map of the trees on the Sacramento State campus, built from the numbered tags on each tree."
updated: "2026-11-20"
---

CSUS-Trees is a crowd-sourced map of the trees on the Sacramento State campus. Many campus trees have a small numbered tag nailed to the trunk. Anyone can open the map and browse the trees that have been added so far, tap a tree to see its number and species, and see where they are standing on campus.

To add a tree, a signed-in visitor stands next to it with their phone, taps **Add a tree**, types the number from the tag and, if they know it, searches for the species. The phone's GPS records where the tree is. Each person can add one entry per tree number and can update or remove their own entries.

The map does not trust any single entry. Every tree on the map is calculated from all of the entries for its number: the location is the median of everyone's readings, with readings far from the rest set aside once there are enough of them, and the species is the one named most often. The calculation runs in the database every time an entry is added, changed or removed, so the map always reflects everyone's latest input. An entry that lands far from where a tree is already mapped is checked with a quick "Is this really the tree you meant?" question, which catches mistyped numbers.

The project is built with Next.js, React and TypeScript, styled with Tailwind CSS, and hosted on Netlify. Sign-in uses Google through Supabase, and the entries are stored in Supabase's PostgreSQL database, where row level security keeps each person's entries private and database triggers recalculate the map. The map is drawn with MapLibre GL JS using free OpenStreetMap-based tiles from OpenFreeMap, with nearby trees grouped into clusters until you zoom in. The species search covers about 335 trees found in the Sacramento area and matches common or scientific names as you type.
