const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: 'src/index',
  plugins: [
    {
      resolve: '@poi/plugin-eslint'
    }
  ],
  chainWebpack(config) {
    if (isProd) {
      config.plugin('offline').use(require('offline-plugin'), [
        {
          ServiceWorker: {
            output: 'service-worker.js',
            events: true
          },
          AppCache: false,
          excludes: ['favicon.ico']
        }
      ])
    }
  }
}
