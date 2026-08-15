import { useCallback, useEffect, useState } from "react";

export type PlayerLevel = "beginner" | number | undefined;

const STORAGE_KEY = "hgroup-ru-player-level";
const CHANGE_EVENT = "hgroup-ru-player-level-change";

function parsePlayerLevel(value: string | undefined): PlayerLevel {
  if (value === "beginner") {
    return "beginner";
  }

  if (value !== undefined && /^\d+$/v.test(value)) {
    const level = Number(value);
    if (level >= 1 && level <= 25) {
      return level;
    }
  }

  return undefined;
}

function readStoredPlayerLevel(): PlayerLevel {
  const storedValue = globalThis.localStorage.getItem(STORAGE_KEY) ?? undefined;
  return parsePlayerLevel(storedValue);
}

export function formatPlayerLevel(level: PlayerLevel): string {
  if (level === "beginner") {
    return "Beginner";
  }
  if (typeof level === "number") {
    return `L${level}`;
  }
  return "";
}

export function usePlayerLevel(): readonly [
  PlayerLevel,
  (level: PlayerLevel) => void,
] {
  const [level, setLevel] = useState<PlayerLevel>();

  useEffect(() => {
    const sync = () => {
      setLevel(readStoredPlayerLevel());
    };
    sync();

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        sync();
      }
    };
    const onLocalChange = () => {
      sync();
    };

    globalThis.addEventListener("storage", onStorage);
    globalThis.addEventListener(CHANGE_EVENT, onLocalChange);
    return () => {
      globalThis.removeEventListener("storage", onStorage);
      globalThis.removeEventListener(CHANGE_EVENT, onLocalChange);
    };
  }, []);

  const updateLevel = useCallback((nextLevel: PlayerLevel) => {
    if (nextLevel === undefined) {
      globalThis.localStorage.removeItem(STORAGE_KEY);
    } else {
      globalThis.localStorage.setItem(STORAGE_KEY, String(nextLevel));
    }
    setLevel(nextLevel);
    globalThis.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [level, updateLevel] as const;
}
