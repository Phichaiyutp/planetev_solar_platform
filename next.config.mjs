/** @type {import('next').NextConfig} */
const nextConfig = { 
    output: 'standalone',
    reactStrictMode: false,
    async redirects() {
        return [
          {
            source: '/',
            destination: '/dashboard',
            permanent: true,
          },
        ]
      },
};

export default nextConfig;
