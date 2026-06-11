import type { NextConfig } from "next";

// Cabeçalhos de segurança aplicados a todas as respostas.
// CSP permite só o necessário: imagens (data: p/ fotos base64 + capas https),
// áudio dos previews (Spotify/Deezer) e conexões às nossas APIs/Supabase.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },                          // anti-clickjacking
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next inlina runtime/estilos; 'unsafe-inline' é necessário aqui
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https: blob:",
      "connect-src 'self' https://*.supabase.co",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
