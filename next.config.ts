import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disco local com pouco espaço livre — cache persistente do Turbopack
  // já causou erros de ENOSPC durante o dev. Desativado até haver mais folga.
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
