/** @type {import('next').NextConfig} */
const nextConfig = { 
    output: 'standalone',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    reactStrictMode: false,
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
