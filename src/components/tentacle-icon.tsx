/**
 * Иконки щупалец в стиле иконок умений Cyberpunk 2077:
 * угловатая линейная графика, тонкий штрих, без заливки.
 * Цвет наследуется от темы через currentColor.
 */

import type { ReactElement } from "react";

type IconProps = {
  id: string;
  className?: string;
  /** толщина штриха */
  strokeWidth?: number;
};

const P: Record<string, ReactElement> = {
  "octo-chat": (
    <>
      <path d="M3 5h18v11H9l-6 5V5z" />
      <path d="M7 9h10M7 12h6" />
    </>
  ),
  extraction: (
    <>
      <path d="M12 2l8 4v6l-8 10-8-10V6l8-4z" />
      <path d="M12 8v8M8 11h8" />
    </>
  ),
  diagnostics: (
    <>
      <path d="M2 12h4l2-6 3 12 3-9 2 3h6" />
      <path d="M3 4h18v16H3z" opacity=".35" />
    </>
  ),
  persona: (
    <>
      <path d="M12 3l7 4v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V7l7-4z" />
      <path d="M9 10h1.5M13.5 10H15M9.5 14h5" />
    </>
  ),
  memory: (
    <>
      <path d="M6 4h12v16H6z" />
      <path d="M9 8h6v8H9zM3 8h3M3 12h3M3 16h3M18 8h3M18 12h3M18 16h3" />
    </>
  ),
  lovable: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  "webgen-edit": (
    <>
      <path d="M3 4h18v16H3z" />
      <path d="M3 8h18M7 12l-2 2 2 2M13 12l2 2-2 2" />
    </>
  ),
  "presentation-edit": (
    <>
      <path d="M2 4h20v12H2z" />
      <path d="M12 16v4M8 21h8M6 12l3-4 3 3 3-5" />
    </>
  ),
  officecli: (
    <>
      <path d="M5 2h9l5 5v15H5z" />
      <path d="M14 2v5h5M8 12h8M8 16h5" />
    </>
  ),
  media: (
    <>
      <path d="M2 5h20v14H2z" />
      <path d="M10 9l5 3-5 3V9zM2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  analyze: (
    <>
      <path d="M4 20V9M9 20V4M14 20v-8M19 20V7" />
      <path d="M2 22h20" />
    </>
  ),
  generator: (
    <>
      <path d="M12 2l3 6 6 1-4 5 1 7-6-3-6 3 1-7-4-5 6-1 3-6z" />
    </>
  ),
  coder: (
    <>
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
    </>
  ),
  services: (
    <>
      <path d="M4 4h16v5H4zM4 15h16v5H4z" />
      <path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M6 10v11h12V10M10 21v-6h4v6" />
    </>
  ),
  skills: (
    <>
      <path d="M12 2l4 4-4 4-4-4 4-4zM4 10l4 4-4 4-2-4 2-4zM20 10l2 4-2 4-4-4 4-4zM12 14l4 4-4 4-4-4 4-4z" />
    </>
  ),
  diffusers: (
    <>
      <path d="M12 3c3 4 6 6 6 10a6 6 0 01-12 0c0-4 3-6 6-10z" />
      <path d="M12 9v8M9 13h6" />
    </>
  ),
  "visual-editor": (
    <>
      <path d="M3 3h18v14H3z" />
      <path d="M3 7h18M8 11l4 3 4-6" />
    </>
  ),
};

const FALLBACK = (
  <>
    <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
    <path d="M12 8l4 2.5v3L12 16l-4-2.5v-3L12 8z" />
  </>
);

export function TentacleIcon({ id, className = "h-5 w-5", strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {P[id] ?? FALLBACK}
    </svg>
  );
}
