type PlaceholderSvgArgs = {
  label: string;
  fill: string;
  accent?: string;
  stroke?: string;
  stage?: "body" | "hair" | "eyes" | "mouth" | "top" | "bottom" | "shoes" | "accessory";
  emotion?: string;
};

const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export function createPlaceholderSvg({
  label,
  fill,
  accent = "#ffffff",
  stroke = "#0d1220",
  stage = "body",
  emotion = "normal"
}: PlaceholderSvgArgs) {
  const common = `fill="${fill}" stroke="${stroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" role="img" aria-label="${label}">
      <rect width="400" height="560" rx="42" fill="transparent"/>
      <text x="200" y="38" text-anchor="middle" font-size="22" fill="${accent}" opacity="0.65">${label}</text>
      ${
        stage === "body"
          ? `<path ${common} d="M150 152c-18 18-32 50-36 86l-24 148c-4 26 13 52 39 60l31 10c14 5 30 7 46 7h48c16 0 32-2 46-7l31-10c26-8 43-34 39-60l-24-148c-4-36-18-68-36-86-18-18-47-28-80-28h-1c-33 0-62 10-80 28Z" opacity="0.92"/>`
          : stage === "hair"
            ? `<path ${common} d="M133 154c-4-64 41-104 99-104 62 0 105 46 99 110 0 0-16-26-47-35-15-4-21-2-35-8-16-6-18-13-33-13-16 0-18 8-34 13-15 5-21 3-36 8-29 9-43 29-43 29Z" fill="${fill}"/>`
            : stage === "eyes"
              ? `<g fill="none" stroke="${stroke}" stroke-width="8" stroke-linecap="round"><path d="M153 216c12-10 28-10 40 0"/><path d="M207 216c12-10 28-10 40 0"/></g>
                 <circle cx="173" cy="218" r="6" fill="${accent}"/>
                 <circle cx="227" cy="218" r="6" fill="${accent}"/>
                 ${
                   emotion === "happy"
                     ? `<path d="M160 238c8 8 20 12 40 12s32-4 40-12" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>`
                     : emotion === "sad"
                       ? `<path d="M160 245c8-6 20-9 40-9s32 3 40 9" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>`
                       : emotion === "angry"
                         ? `<path d="M154 208c12-8 28-10 40-4" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>
                            <path d="M206 204c12-6 28-4 40 4" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>`
                         : emotion === "surprised"
                           ? `<circle cx="173" cy="222" r="10" fill="none" stroke="${stroke}" stroke-width="7"/>
                              <circle cx="227" cy="222" r="10" fill="none" stroke="${stroke}" stroke-width="7"/>`
                           : emotion === "sleepy"
                             ? `<path d="M152 220c18 8 24 8 40 0" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>
                                <path d="M206 220c18 8 24 8 40 0" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>`
                             : ""
                 }`
              : stage === "mouth"
                ? emotion === "happy"
                  ? `<path ${common} d="M165 275c14 15 58 15 70 0" fill="none" stroke="${stroke}" stroke-width="8"/>`
                  : emotion === "sad"
                    ? `<path ${common} d="M165 287c14-14 58-14 70 0" fill="none" stroke="${stroke}" stroke-width="8"/>`
                    : emotion === "angry"
                      ? `<path ${common} d="M162 282h76" fill="none" stroke="${stroke}" stroke-width="8"/>`
                      : emotion === "surprised"
                        ? `<circle cx="200" cy="282" r="14" fill="none" stroke="${stroke}" stroke-width="8"/>`
                        : emotion === "sleepy"
                          ? `<path ${common} d="M166 280h68" fill="none" stroke="${stroke}" stroke-width="8"/>`
                          : `<path ${common} d="M170 280c12 10 48 10 60 0" fill="none" stroke="${stroke}" stroke-width="8"/>`
                : stage === "top"
                  ? `<path ${common} d="M132 292c18-20 38-30 68-30s50 10 68 30v120c0 14-12 26-26 26H158c-14 0-26-12-26-26V292Z"/>`
                  : stage === "bottom"
                    ? `<path ${common} d="M160 408h80l14 78c2 12-8 24-20 24h-22c-10 0-18-8-18-18v-30h-4v30c0 10-8 18-18 18h-22c-12 0-22-12-20-24l20-78Z"/>`
                    : stage === "shoes"
                      ? `<path ${common} d="M146 510h70c8 0 14 6 14 14 0 8-6 14-14 14h-72c-10 0-18-8-18-18v-10h20ZM184 510h70c8 0 14 6 14 14 0 8-6 14-14 14h-72c-10 0-18-8-18-18v-10h20Z"/>`
                      : `<circle cx="200" cy="92" r="32" fill="${fill}" opacity="0.95"/>`
      }
    </svg>
  `;
  return svgToDataUri(svg);
}
