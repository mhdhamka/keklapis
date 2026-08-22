import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimization: Keep image optimization unoptimized if deploying to static/standalone targets where sharp isn't bundled
  images: {
    unoptimized: true,
  },
  
  // Development: Local network access origins
  allowedDevOrigins: ['192.168.1.116', '*.192.168.1.116', '*.local'],

  // Deployment: Output standalone build for Docker/Node production containers
  output: 'standalone',

  // Performance & Build Speed Optimizations
  experimental: {
    webpackBuildWorker: true, // Enables parallel compilation via worker threads
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'], // Speeds up tree-shaking for icons/UI libs
  },
};

export default withNextIntl(nextConfig);
