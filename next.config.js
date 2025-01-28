/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

// Configuring PWA
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

const nextConfig = withPWA({
  trailingSlash: true,
  reactStrictMode: false,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  experimental: {
    newNextLinkBehavior: true
  }
})

module.exports = nextConfig

// module.exports = {
//   trailingSlash: true,
//   reactStrictMode: false,
//   webpack: config => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
//     }

//     return config
//   }
// }
