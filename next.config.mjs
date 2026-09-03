import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/* GitHub Pages is a plain file host: no Node process, so no image
   optimiser and no server routes. The site is exported to out/ as
   static HTML and, because a project repo is served from
   https://<user>.github.io/<repo>/, everything Next emits has to be
   prefixed with that repo name. The deploy workflow passes it in;
   locally it is empty, so `next dev` and `next build` behave as
   before. Hand-written paths into public/ are prefixed separately —
   see lib/asset.ts. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  /* Directory-style URLs (/page/index.html) are what a static file
     host resolves without a rewrite rule. */
  trailingSlash: true,
  images: { unoptimized: true },
  // The repo has a lockfile at its root as well, so Turbopack has to be
  // told which directory this app actually is.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
