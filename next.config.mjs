/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactCompiler requires babel-plugin-react-compiler — disabled for Vercel compat
  // reactCompiler: true,

  // Allow images from Firebase Storage and CDNs
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cdnjs.cloudflare.com" },
    ],
  },
};

export default nextConfig;
