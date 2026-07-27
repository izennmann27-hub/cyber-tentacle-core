import { THEMES, type ThemeSlug } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface Props {
  value: ThemeSlug;
  onChange: (slug: ThemeSlug) => void;
}

export function ThemeSwitcher({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {THEMES.map((t) => {
        const active = value === t.slug;
        return (
          <button
            key={t.slug}
            onClick={() => onChange(t.slug)}
            className={cn(
              "group relative overflow-hidden rounded-md px-3 py-2 text-left transition-all",
              "panel glitch-clip",
              active ? "neon-border scale-[1.02]" : "hover:border-primary/60",
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-4 gap-0.5">
                {t.swatch.map((c, i) => (
                  <span
                    key={i}
                    className="h-4 w-2 rounded-sm ring-1 ring-black/40"
                    style={{ background: c }}
                  />
                ))}
              </div>
              {active ? (
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-primary">
                  active
                </span>
              ) : null}
            </div>
            <div className="mt-2 font-display text-[11px] font-bold uppercase tracking-[0.18em]">
              {t.name}
            </div>
            <div className="text-[10px] text-muted-foreground">{t.tagline}</div>
          </button>
        );
      })}
    </div>
  );
}