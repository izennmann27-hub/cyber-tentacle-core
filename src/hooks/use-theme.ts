import { useEffect, useState } from "react";
import { applyTheme, DEFAULT_THEME, THEMES, type ThemeSlug } from "@/lib/themes";

const KEY = "kraken.theme";

function readInitial(): ThemeSlug {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const v = window.localStorage.getItem(KEY) as ThemeSlug | null;
  if (v && THEMES.some((t) => t.slug === v)) return v;
  return DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeSlug>(DEFAULT_THEME);

  useEffect(() => {
    const initial = readInitial();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const update = (next: ThemeSlug) => {
    setTheme(next);
    applyTheme(next);
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
  };

  return { theme, setTheme: update };
}