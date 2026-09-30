import { useSyncExternalStore } from "react";

/**
 * A tiny external store backed by one localStorage key, read through
 * useSyncExternalStore. The server (and the first client render, during
 * hydration) sees `serverValue`; the client then switches to the stored value
 * without a setState-in-effect round trip. Writes notify every subscriber in
 * this tab, and the `storage` event keeps other tabs in sync.
 */
export function createLocalStorageStore<T>(
  key: string,
  parse: (raw: string | null) => T,
  serialize: (value: T) => string,
  serverValue: T,
) {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = serverValue;

  function read(): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  // Parse only when the raw string changes, so the snapshot stays referentially
  // stable between calls (required by useSyncExternalStore).
  function getSnapshot(): T {
    const raw = read();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  }

  function getServerSnapshot(): T {
    return serverValue;
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function set(value: T) {
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      /* noop */
    }
    listeners.forEach((l) => l());
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  return { useValue, set, get: getSnapshot };
}
