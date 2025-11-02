/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'coverartarchive.org',
      'lastfm.freetls.fastly.net',
      'i.scdn.co',
      'upload.wikimedia.org',
      'www.theaudiodb.com',
    ],
  },
  env: {
    LASTFM_API_KEY: process.env.LASTFM_API_KEY || 'YOUR_LASTFM_API_KEY',
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '',
  },
}

module.exports = nextConfig

