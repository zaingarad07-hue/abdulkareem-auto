/**
 * Regenerates src/remotion/font-faces.ts by embedding the brand woff2 files as
 * base64 data-URIs. Run with: npm run video:fonts
 *
 * Source font files live in public/fonts and originate from the
 * @fontsource/orbitron and @fontsource/tajawal packages.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const faces = [
  ["Orbitron", "400", "normal", "public/fonts/orbitron-latin-400-normal.woff2"],
  ["Orbitron", "700", "normal", "public/fonts/orbitron-latin-700-normal.woff2"],
  ["Orbitron", "800", "normal", "public/fonts/orbitron-latin-800-normal.woff2"],
  ["Tajawal", "400", "normal", "public/fonts/tajawal-arabic-400-normal.woff2"],
  ["Tajawal", "500", "normal", "public/fonts/tajawal-arabic-500-normal.woff2"],
  ["Tajawal", "700", "normal", "public/fonts/tajawal-arabic-700-normal.woff2"],
];

let css = "";
for (const [family, weight, style, file] of faces) {
  const b64 = readFileSync(resolve(root, file)).toString("base64");
  css +=
    `@font-face{font-family:"${family}";font-style:${style};` +
    `font-weight:${weight};font-display:block;` +
    `src:url("data:font/woff2;base64,${b64}") format("woff2");}\n`;
}

const out =
  `/* AUTO-GENERATED — do not edit by hand.\n` +
  ` * Brand fonts (Orbitron + Tajawal) embedded as base64 woff2 data-URIs so the\n` +
  ` * video renders deterministically with no network or file-path dependency.\n` +
  ` * Regenerate with: npm run video:fonts (scripts/build-fonts.mjs).\n` +
  ` * Sources: @fontsource/orbitron, @fontsource/tajawal.\n` +
  ` */\nexport const FONT_FACE_CSS = ${JSON.stringify(css)};\n`;

writeFileSync(resolve(root, "src/remotion/font-faces.ts"), out);
console.log(
  `Wrote src/remotion/font-faces.ts — ${(out.length / 1024).toFixed(1)} KB`,
);
