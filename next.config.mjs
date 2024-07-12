/** @type {import('next').NextConfig} */
const nextConfig = { 
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'openweathermap.org',
          port: '',
          pathname: '/img/wn/**',
        },
      ],
    },
    output: 'standalone',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    reactStrictMode: false,
    experimental: {
      serverActions: {
        allowedOrigins: ["platform.planet-ev.com:99","137.59.112.61:99","platform.planet-ev.com:8443","137.59.112.61:8443", "localhost:3000"]
      }
    },
    async redirects() {
        return [
          {
            source: `/`,
            destination: `/dashboard`,
            permanent: false,
            //basePath: false,
          },
        ]
      },
};

export default nextConfig;
