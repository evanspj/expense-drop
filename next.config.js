module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
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
};
