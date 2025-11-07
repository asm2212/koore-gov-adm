/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
       {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dnoqcuwhz/**', // Replace `dnoqcuwhz` with your actual Cloudinary cloud name
        port: '',
      },
    ],
  },
};

export default nextConfig;
