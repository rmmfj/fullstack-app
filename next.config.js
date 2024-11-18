/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "dmbkhireuarjpvecjmds.supabase.co",
      },
      {
        protocol: "https",
        hostname: "jmgowbnhsejplwjfhpnv.supabase.co",
      },
      {
        protocol: "https",
        hostname: "media.discordapp.net",
      },
      {
        protocol: "https",
        hostname: "eapzlwxcyrinipmcdoir.supabase.co",
      },
      {
        protocol: "https",
        hostname: "image.uniqlo.com",
      },
      {
        protocol: "https",
        hostname: "www.uniqlo.com",
      },
      {
        protocol: "https",
        hostname: "s3.hicloud.net.tw",
      },
      {
        protocol: "https",
        hostname: "www.50-shop.com",
      },
      {
        protocol: "https",
        hostname: "lp2.hm.com",
      },
      {
        protocol: "https",
        hostname: "clothing.rfjmm.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // Set desired value here
    },
  },
  webpack: (config, { isServer }) => {
    if (process.env.NODE_ENV === "production") {
      console.log = function (message) {
        process.stdout.write(message + "\n");
      };
    }
    return config;
  },
};

module.exports = nextConfig;