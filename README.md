# oman-luxury-demo

A single-page concept site for OMANLUXURY — Next.js 16, Tailwind 4, GSAP, Lenis.

## Local

```bash
npm install
npm run dev          # http://localhost:3000
```

## Hosting on GitHub Pages

The site is exported as static HTML, so GitHub Pages can serve it with no
server. A push to `main` triggers `.github/workflows/deploy.yml`, which builds
and publishes it.

**One-time setup, in the repo on github.com:**

Settings → Pages → *Build and deployment* → **Source: GitHub Actions**.

That's it. Push to `main`, watch the run in the Actions tab, and the site
appears at:

```
https://harshpopat2003.github.io/oman-luxury-demo/
```

### Why the base path matters

A project site is served from `/<repo>/`, not from the domain root, so every
URL has to carry that prefix. The workflow passes the repo name in as
`NEXT_PUBLIC_BASE_PATH`; `next.config.mjs` hands it to Next as `basePath` (which
covers the JS, CSS and fonts) and [`lib/asset.ts`](lib/asset.ts) applies it to
the image paths in `lib/content.ts`, which Next does not rewrite. **New image
references must go through `asset()`** or they will 404 on Pages while working
fine in `next dev`.

To preview exactly what Pages serves:

```bash
NEXT_PUBLIC_BASE_PATH=/oman-luxury-demo npm run build
# then serve out/ from a parent directory as /oman-luxury-demo/
```

### On a custom domain

At a domain root there is no prefix: drop `NEXT_PUBLIC_BASE_PATH` from the
workflow's build step and add the domain under Settings → Pages → Custom domain.
