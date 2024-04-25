/** @type {import('next').NextConfig} */

module.exports = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/logout',
        destination: '/',
        permanent: true,
      }
    ]
  },
}
