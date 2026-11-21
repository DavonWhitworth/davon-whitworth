"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Modal } from "@/components/Modal";
import { signInWithGoogle } from "@/components/auth/supabase-browser";
import {
  MAX_ACCURACY_M,
  checkReading,
  isOnCampus,
  parseTreeNumber,
  type MyReading,
  type ProductionTree,
  type ReadingInput,
} from "@/features/csus-trees/model";
import { saveReading } from "@/features/csus-trees/ui/api";
import { useIsTouchDevice, type LocationStatus, type UserPosition } from "@/features/csus-trees/ui/hooks";
import { LocationLine } from "@/features/csus-trees/ui/LocationLine";
import { SpeciesPicker } from "@/features/csus-trees/ui/SpeciesPicker";

// The "Add a tree" dialog: tree number, optional species, and the device's
// current location. The server checks everything again.

type Props = {
  open: boolean;
  onClose: () => void;
  signedIn: boolean | undefined;
  location: { status: LocationStatus; position: UserPosition | null; start: () => void };
  onSaved: (tree: ProductionTree, created: boolean, reading: MyReading) => void;
};

/** A reading older than this is too stale to save as "where I'm standing". */
const MAX_POSITION_AGE_MS = 30_000;

// While developing on a laptop, skip the touch-screen check (and say so).
const SKIP_TOUCH_CHECK = process.env.NODE_ENV === "development";

const buttonPrimary =
  "rounded-full bg-accent px-5 py-2.5 font-medium text-accent-contrast transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50";
const buttonSecondary =
  "rounded-full border border-border px-5 py-2.5 font-medium text-fg transition-colors hover:bg-surface-2";

type Step = { kind: "form" } | { kind: "confirmFar"; message: string; input: ReadingInput; treeNumber: number };

export function AddTreeModal({ open, onClose, signedIn, location, onSaved }: Props) {
  const isTouch = useIsTouchDevice();
  const numberId = useId();
  const speciesId = useId();
  const numberRef = useRef<HTMLInputElement>(null);

  const [numberText, setNumberText] = useState("");
  const [species, setSpecies] = useState<string | null>(null);
  const [step, setStep] = useState<Step>({ kind: "form" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function reset() {
    setNumberText("");
    setSpecies(null);
    setStep({ kind: "form" });
    setError(null);
    setSaving(false);
  }

  function close() {
    reset();
    onClose();
  }

  const { status, position } = location;
  const accurate = position !== null && position.accuracyM <= MAX_ACCURACY_M;
  const onCampus = position !== null && isOnCampus(position.lat, position.lng);

  async function submit(input: ReadingInput, treeNumber: number) {
    setSaving(true);
    setError(null);
    const result = await saveReading(treeNumber, input);
    setSaving(false);

    if (result.ok) {
      onSaved(result.data.tree, result.data.created, result.data.reading);
      close();
      return;
    }
    if (result.error.code === "far_from_tree") {
      setStep({ kind: "confirmFar", message: result.error.error, input, treeNumber });
      return;
    }
    setStep({ kind: "form" });
    setError(result.error.error);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const treeNumber = parseTreeNumber(numberText);
    if (treeNumber === null) {
      setError("Enter the number on the tree's tag: a whole number from 1 to 9999.");
      numberRef.current?.focus();
      return;
    }
    if (!position) {
      setError("Waiting for your location.");
      return;
    }
    if (Date.now() - position.timestamp > MAX_POSITION_AGE_MS) {
      setError("Your location is out of date. Wait a moment for a fresh GPS reading.");
      return;
    }
    const input: ReadingInput = {
      lat: position.lat,
      lng: position.lng,
      accuracyM: position.accuracyM,
      speciesId: species,
    };
    const problem = checkReading({ ...input, speciesId: species });
    if (problem === "accuracy_too_low") {
      setError(`Your location needs to be accurate to ${MAX_ACCURACY_M} m or better. Try stepping out from under the tree's canopy.`);
      return;
    }
    if (problem === "off_campus") {
      setError("You need to be on the Sacramento State campus to add a tree.");
      return;
    }
    if (problem) {
      setError("Something about that entry isn't valid. Please check it and try again.");
      return;
    }
    void submit(input, treeNumber);
  }

  function renderBody() {
    if (!isTouch && !SKIP_TOUCH_CHECK) {
      return (
        <p className="text-muted">
          Adding trees works on a phone or tablet, which can use GPS to record exactly
          where the tree is. Open this page on your phone while you&apos;re standing at the tree.
        </p>
      );
    }

    if (signedIn === undefined) {
      return <p className="text-muted">Checking your sign-in&hellip;</p>;
    }

    if (!signedIn) {
      return (
        <div>
          <p className="text-muted">Sign in with your Google account to add trees.</p>
          <button type="button" onClick={() => void signInWithGoogle()} className={`${buttonPrimary} mt-5`}>
            Sign in with Google
          </button>
        </div>
      );
    }

    if (step.kind === "confirmFar") {
      return (
        <div>
          <p className="text-fg">{step.message}</p>
          {error ? <p className="mt-3 text-sm text-status-archived" role="alert">{error}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => void submit({ ...step.input, confirmFar: true }, step.treeNumber)}
              className={buttonPrimary}
            >
              {saving ? "Saving…" : `Yes, it's #${step.treeNumber}`}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep({ kind: "form" });
                setError(null);
                requestAnimationFrame(() => numberRef.current?.focus());
              }}
              className={buttonSecondary}
            >
              No, fix the number
            </button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={onSubmit} noValidate>
        {SKIP_TOUCH_CHECK && !isTouch ? (
          <p className="mb-4 rounded-md border border-border px-3 py-2 text-xs text-muted">
            Development mode: the phone-only check is skipped on this computer.
          </p>
        ) : null}

        <label htmlFor={numberId} className="block font-medium text-fg">
          Tree number
        </label>
        <p className="text-sm text-muted">The number on the tree&apos;s metal tag.</p>
        <input
          ref={numberRef}
          id={numberId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={8}
          autoComplete="off"
          value={numberText}
          onChange={(event) => setNumberText(event.target.value.replace(/\D/g, ""))}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-lg text-fg"
        />

        <label htmlFor={speciesId} className="mt-5 block font-medium text-fg">
          Species <span className="font-normal text-muted">(optional)</span>
        </label>
        <div className="mt-2">
          <SpeciesPicker inputId={speciesId} value={species} onChange={setSpecies} />
        </div>

        <div className="mt-5 rounded-lg border border-border px-3 py-2 text-sm" aria-live="polite">
          <LocationLine status={status} position={position} accurate={accurate} onCampus={onCampus} onRetry={location.start} />
        </div>

        {error ? (
          <p className="mt-4 text-sm text-status-archived" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={saving || !accurate || !onCampus} className={buttonPrimary}>
            {saving ? "Saving…" : "Save tree"}
          </button>
          <button type="button" onClick={close} className={buttonSecondary}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    // Near the top on phones, so the on-screen keyboard doesn't cover the form.
    <Modal open={open} onClose={close} label="Add a tree" placement="top">
      <h2 className="mb-4 text-xl font-semibold text-fg">Add a tree</h2>
      {renderBody()}
    </Modal>
  );
}
