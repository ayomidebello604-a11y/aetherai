/** @type {import('next').NextConfig} */
import dns from "dns";

// Force IPv4 for all Node.js DNS lookups — fixes IPv6 issues on mobile hotspot
dns.setDefaultResultOrder("ipv4first");

const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['172.20.10.2'],
  serverExternalPackages: ["@google/generative-ai", "groq-sdk"],
  experimental: {
    esmExternals: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Forwarded-Host, Accept-Language, Content-Language, Content-Type, Authorization' },
        ],
      },
    ]
  },
}

export default nextConfig;