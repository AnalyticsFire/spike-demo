import webpack from 'webpack';

module.exports = {
  entry: {
    app: __dirname + '/../../config/development/app',
    style: __dirname + '/../../config/development/style'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/../../build/development'
  },
  module: {
      loaders: [
          {
              test: /\.scss$/,
              loaders: ['style', 'raw', 'sass']
          }, {
              test: /\.css$/,
              loaders: ['style', 'raw']
          }, {
            test: /\.js$/,
            loader: 'babel'
          }, {
            test: /\.json$/,
            loader: 'json'
          }, {
            test: /\.rt/,
            loader: "react-templates-loader"
          }
      ]
  },
  sassLoader: {
    includePaths: [__dirname + '/../..', __dirname + '/../../../node_modules']
  },
  plugins: [
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      }),
      new webpack.ProvidePlugin({
          d3: "d3",
          "window.d3": "d3"
      })
  ],
  node: {
    fs: "empty"
  },
  resolve: {
      alias: {
          api: __dirname + '/../../api/development',
          config: __dirname + '/../../config/development'
      }
  }
}
