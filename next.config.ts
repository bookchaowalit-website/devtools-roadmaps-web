import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // /api/mcp reads content/roadmaps at request time, so ship those files with the function.
  outputFileTracingIncludes: { "/api/mcp": ["./content/**"] },
};

export default nextConfig;
