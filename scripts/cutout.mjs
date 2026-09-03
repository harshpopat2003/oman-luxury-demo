/**
 * Turn the house's white-background product shots into real alpha.
 *
 * Naive "luminance to alpha" eats the specular highlights on the black
 * cap and the pale glass of Wanderlust. So instead: flood in from the
 * border through pixels that are BOTH light and near-neutral. That
 * walk crosses the white ground and the grey cast shadow, and stops
 * dead at anything saturated (amber liquid) or dark (the cap).
 *
 * Pixels the flood reached get un-multiplied against white, which is
 * what keeps the cast shadow a soft translucent grey instead of a
 * hard grey blob. Everything the flood never touched stays opaque.
 */
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2];
const DST = process.argv[3];
const only = process.argv[4] ? process.argv[4].split(",") : null;

// A pixel is "ground" if it is light and close to neutral grey.
const MIN_LIGHT = 150; // darker than this is subject, never ground
const MAX_SAT = 26; // max(rgb) - min(rgb); amber liquid is far above

async function cut(file) {
  const input = join(SRC, file);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels: ch } = info;
  const ground = new Uint8Array(w * h);
  const stack = [];

  const isGroundish = (i) => {
    const r = data[i * ch];
    const g = data[i * ch + 1];
    const b = data[i * ch + 2];
    const mn = Math.min(r, g, b);
    const mx = Math.max(r, g, b);
    return mn >= MIN_LIGHT && mx - mn <= MAX_SAT;
  };

  // Seed from every border pixel.
  for (let x = 0; x < w; x++) {
    stack.push(x, (h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    stack.push(y * w, y * w + w - 1);
  }

  while (stack.length) {
    const i = stack.pop();
    if (ground[i]) continue;
    if (!isGroundish(i)) continue;
    ground[i] = 1;
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }

  let cleared = 0;
  for (let i = 0; i < w * h; i++) {
    if (!ground[i]) {
      data[i * ch + 3] = 255;
      continue;
    }
    const p = i * ch;
    const mn = Math.min(data[p], data[p + 1], data[p + 2]);
    // Un-multiply against white: C_white = C·a + 255·(1−a)
    const a = 1 - mn / 255;
    if (a <= 0.004) {
      data[p + 3] = 0;
      cleared++;
      continue;
    }
    for (let c = 0; c < 3; c++) {
      data[p + c] = Math.max(0, Math.min(255, Math.round((data[p + c] - 255 * (1 - a)) / a)));
    }
    data[p + 3] = Math.round(a * 255);
  }

  const out = join(DST, file.replace(/\.jpe?g$/i, ".png"));
  await sharp(data, { raw: { width: w, height: h, channels: ch } })
    .png({ compressionLevel: 9, palette: false })
    .toFile(out);

  const pct = ((cleared / (w * h)) * 100).toFixed(1);
  console.log(`${file.padEnd(24)} ${w}x${h}  cleared ${pct}%`);
}

const files = readdirSync(SRC).filter(
  (f) => /\.jpe?g$/i.test(f) && (!only || only.includes(f)),
);
for (const f of files) await cut(f);
