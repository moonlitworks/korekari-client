module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Korekari',
    },
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  }
}