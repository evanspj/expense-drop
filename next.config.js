module.exports = {
  reactStrictMode: true,
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
