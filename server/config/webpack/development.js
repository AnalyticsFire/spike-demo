const ROOT = __dirname + '/../../../';

module.exports = {
  entry: {
    app: ROOT + 'client/app',
    style: ROOT + 'client/style'
  },
  output: {
    filename: '[name].js',
    path: ROOT + 'client/build/development'
  },
  externals: {
    jquery: "$",
    d3: "d3"
  },
  module: {
      loaders: [
          {
              test: /\.scss$/,
              loader: ['style', 'raw', 'sass']
          }, {
              test: /\.css$/,
              loader: ['style', 'raw']
          }
      ]
  },
  sassLoader: {
    includePaths: [ROOT + 'client', ROOT + 'node_modules']
  },
  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
      new ExtractTextPlugin("style.css", {
        allChunks: true
      }),
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      })
  ]
}
