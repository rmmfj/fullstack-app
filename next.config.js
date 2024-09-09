/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: 'dmbkhireuarjpvecjmds.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'jmgowbnhsejplwjfhpnv.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'media.discordapp.net',
      },
      {
        protocol: 'https',
        hostname: 'eapzlwxcyrinipmcdoir.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'image.uniqlo.com',
      },
      {
        protocol: 'https',
        hostname: 'www.uniqlo.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // Set desired value here
    },
  },
};

module.exports = nextConfig;