/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "**", pathname: "/**" },
      { hostname: "res.cloudinary.com" },
      { hostname: "placehold.co" },
      { hostname: "images.unsplash.com" },
    ],
  },
}

export default nextConfig
