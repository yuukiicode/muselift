/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lastfm.freetls.fastly.net',
      'i.scdn.co',
      'coverartarchive.org',
      'upload.wikimedia.org',
      'is1-ssl.mzstatic.com'
    ],
    unoptimized: true
  },
  env: {
    LASTFM_API_KEY: process.env.LASTFM_API_KEY || 'YOUR_LASTFM_KEY',
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || ''
  }
}

module.exports = nextConfig
