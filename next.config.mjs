import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  turbopack: {
    root: projectRoot
  },
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
