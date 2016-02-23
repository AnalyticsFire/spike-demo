import webpack from 'webpack';

const CLIENT = __dirname + '/..';
const ROOT = CLIENT + '/..';

module.exports = {
  entry: {
    app: CLIENT + '/config/' + process.env.NODE_ENV + '/app',
    style: CLIENT + '/config/' + process.env.NODE_ENV + '/style'
  },
  output: {
    filename: '[name].js',
    path: CLIENT + '/build/' + process.env.NODE_ENV
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
          }
      ]
  },
  sassLoader: {
    includePaths: [CLIENT, ROOT + '/node_modules']
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
          api: CLIENT + '/api/' + process.env.NODE_ENV,
          config: CLIENT + '/config/' + process.env.NODE_ENV
      }
  }
}
