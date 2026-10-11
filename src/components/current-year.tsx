"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Visitor's current year. `buildYear` comes from the server render, so
 * hydration matches the prerendered HTML even after the year changes.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  return <>{year}</>;
}
