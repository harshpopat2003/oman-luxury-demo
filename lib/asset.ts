/**
 * GitHub Pages serves a project repository from a sub-path
 * (/oman-luxury-demo/), never from the domain root. Next rewrites the
 * URLs it owns — the JS, the CSS, the self-hosted fonts — for
 * `basePath` on its own, but anything hand-written that points into
 * public/ is passed through untouched. So every image path goes
 * through here.
 *
 * The value is inlined at build time, and is empty for `next dev` and
 * for any host that serves this at a domain root, where this is a
 * no-op.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return `${basePath}${path}`;
}
