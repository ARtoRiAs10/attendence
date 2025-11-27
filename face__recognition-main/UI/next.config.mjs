/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Disable TypeScript type checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
