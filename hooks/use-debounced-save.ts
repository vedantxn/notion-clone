"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseDebouncedSaveResult<T> {
    status: SaveStatus;
    /** Queue a value to be saved after the debounce delay. */
    schedule: (value: T) => void;
    /** Immediately write any pending value (used on unmount / page switch). */
    flush: () => void;
    /** Drop any pending value without writing it. */
    cancel: () => void;
}

/**
 * Debounced save with:
 *  - a single trailing write per burst (no Convex write per keystroke),
 *  - a monotonically increasing sequence so a slow, stale save can never
 *    clobber the status of a newer edit,
 *  - `flush` on unmount so the latest edit is persisted when switching pages,
 *  - full timer cleanup.
 *
 * The `save` callback should close over the target document id so a flush
 * during a page switch always writes to the correct document.
 */
export function useDebouncedSave<T>(
    save: (value: T) => Promise<unknown>,
    delay = 600
): UseDebouncedSaveResult<T> {
    const [status, setStatus] = useState<SaveStatus>("idle");

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pending = useRef<{ value: T } | null>(null);
    const seq = useRef(0);

    // Keep the latest save callback without re-subscribing consumers.
    const saveRef = useRef(save);
    saveRef.current = save;

    const runSave = useCallback(async () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        if (!pending.current) {
            return;
        }

        const { value } = pending.current;
        pending.current = null;

        const mySeq = ++seq.current;
        setStatus("saving");

        try {
            await saveRef.current(value);
            // Only report success if no newer save has started since.
            if (mySeq === seq.current) {
                setStatus("saved");
            }
        } catch {
            if (mySeq === seq.current) {
                setStatus("error");
            }
        }
    }, []);

    const schedule = useCallback(
        (value: T) => {
            pending.current = { value };
            setStatus("saving");
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                void runSave();
            }, delay);
        },
        [delay, runSave]
    );

    const flush = useCallback(() => {
        void runSave();
    }, [runSave]);

    const cancel = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        pending.current = null;
    }, []);

    // Flush the latest pending edit and clean up timers on unmount.
    useEffect(() => {
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
            if (pending.current) {
                const { value } = pending.current;
                pending.current = null;
                // Fire-and-forget: the closure targets the correct document.
                void saveRef.current(value);
            }
        };
    }, []);

    return { status, schedule, flush, cancel };
}
