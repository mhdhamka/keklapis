import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimization & Remote Image Patterns
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // handles GitHub avatars too
      },
    ],
  },
  
  // Development: Local network access origins
  allowedDevOrigins: ['192.168.1.116', '*.192.168.1.116', '*.local'],

  // Performance & Build Speed Optimizations
  experimental: {
    webpackBuildWorker: true, // Enables parallel compilation via worker threads
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'], // Speeds up tree-shaking for icons/UI libs
  },
};

export default withNextIntl(nextConfig);