/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: '*',
          },
        ],
      },
    // Enable standalone output for Docker
    output: 'standalone',
};

export default nextConfig;
