const path = require("path");
const vueSrc = "./src";
const BundleTracker = require("webpack-bundle-tracker");

const pages = {
    'editor': {
        entry: './src/editor.js',
        chunks: ['chunk-vendors']
    },
    'artmap': {
        entry: './src/artmap.js',
        chunks: ['chunk-vendors']
    },
    'createnew': {
        entry: './src/createnew.js',
        chunks: ['chunk-vendors']
    },
    'dashboard': {
        entry: './src/dashboard.js',
        chunks: ['chunk-vendors']
    },
}

module.exports = {
    lintOnSave: false,
    pages: pages,
    filenameHashing: false,
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production'
        ? ''
        : 'http://localhost:8080/',
    outputDir: '../artnav/static/vue/',

    chainWebpack: config => {

        config.optimization
            .splitChunks({
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "chunk-vendors",
                        chunks: "all",
                        priority: 1
                    },
                },
            });

        Object.keys(pages).forEach(page => {
            config.plugins.delete(`html-${page}`);
            config.plugins.delete(`preload-${page}`);
            config.plugins.delete(`prefetch-${page}`);
        })

        config
            .plugin('BundleTracker')
            .use(BundleTracker, [{filename: './webpack-stats.json'}]);

        config.resolve.alias
            .set('__STATIC__', 'static')

        config.devServer
            .public('http://localhost:8080')
            .host('localhost')
            .port(8080)
            .hotOnly(true)
            .watchOptions({poll: 1000})
            .https(false)
            .headers({"Access-Control-Allow-Origin": ["*"]})

    },
    configureWebpack: {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, vueSrc)
          },
          extensions: ['.js', '.vue', '.json']
        }
      }
};