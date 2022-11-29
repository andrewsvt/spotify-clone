/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.scdn.co',
      't.scdn.co',
      'newjams-images.scdn.co',
      'dailymix-images.scdn.co',
      'seed-mix-image.spotifycdn.com',
      'charts-images.scdn.co',
      'daily-mix.scdn.co',
      'mixed-media-images.spotifycdn.com',
      'thisis-images.scdn.co',
      'seeded-session-images.scdn.co',
      'mosaic.scdn.co',
    ],
    disableStaticImages: true,
  },
};
