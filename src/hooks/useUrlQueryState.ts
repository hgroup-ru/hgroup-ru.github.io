import { useCallback, useEffect, useState } from "react";

function readQueryParameter(name: string): string {
  const url = new URL(globalThis.location.href);
  return url.searchParams.get(name) ?? "";
}

export function useUrlQueryState(
  name = "q",
): readonly [string, (value: string) => void] {
  const [value, setValue] = useState("");

  useEffect(() => {
    const syncFromLocation = () => {
      setValue(readQueryParameter(name));
    };
    syncFromLocation();
    globalThis.addEventListener("popstate", syncFromLocation);
    return () => {
      globalThis.removeEventListener("popstate", syncFromLocation);
    };
  }, [name]);

  const updateValue = useCallback(
    (nextValue: string) => {
      setValue(nextValue);
      const url = new URL(globalThis.location.href);
      const trimmed = nextValue.trim();
      if (trimmed === "") {
        url.searchParams.delete(name);
      } else {
        url.searchParams.set(name, nextValue);
      }
      globalThis.history.replaceState(globalThis.history.state, "", url);
    },
    [name],
  );

  return [value, updateValue] as const;
}
