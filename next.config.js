/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clothing.rfjmm.com",
      },
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
        hostname: "www.gu-global.com",
      },
      {
        protocol: "https",
        hostname: "www.lativ.com.tw",
      },
      {
        protocol: "https",
        hostname: "s.lativ.com.tw",
      },
      {
        protocol: "https",
        hostname: "www.meierq.com",
      },
      {
        protocol: "https",
        hostname: "pics.meierq.com",
      },
      {
        protocol: "https",
        hostname: "www.net-fashion.net",
      },
      {
        protocol: "https",
        hostname: "net.wimg.tw",
      },
      {
        protocol: "https",
        hostname: "www.obdesign.com.tw",
      },
      {
        protocol: "https",
        hostname: "diz36nn4q02zr.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "www.pazzo.com.tw",
      },
      {
        protocol: "https",
        hostname: "pics.pzcdn.tw",
      },
      {
        protocol: "https",
        hostname: "www.zara.com",
      },
      {
        protocol: "https",
        hostname: "static.zara.net",
      },
      {
        protocol: "https",
        hostname: "www.edwin.com.tw",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // Set desired value here
    },
  },
  webpack: (config, { isServer }) => {
    console.log(
      `LOGGING_ENABLED: ${process.env.LOGGING_ENABLED}, type: ${typeof process
        .env.LOGGING_ENABLED}`
    );
    if (process.env.LOGGING_ENABLED === "true") {
      console.log = function (message) {
        process.stdout.write(message + "\n");
      };
    } else {
      console.log = function (message) {};
    }
    return config;
  },
};

module.exports = nextConfig;
