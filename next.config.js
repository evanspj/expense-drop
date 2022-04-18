const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    isDev: process.argv.includes('dev')
  },
  async redirects () {
    return [
      {
        source: '/months',
        destination: '/',
        permanent: true,
      },
      {
        source: '/accounts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/categories',
        destination: '/',
        permanent: true,
      },
    ];
  },
});
