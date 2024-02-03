/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['zibutton.baconerie.com', 'localhost:8000', 'localhost:1024'],
    },
  },
};

export default nextConfig;
