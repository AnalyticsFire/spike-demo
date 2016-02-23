import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

const ROOT = __dirname + '/../../../';

module.exports = {
  entry: {
    app: ROOT + 'client/config/app',
    style: ROOT + 'client/config/style'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: ROOT + 'client/build/design/assets'
  },
  module: {
    loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style-loader", "raw-loader!sass-loader")
        }, {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "raw-loader")
        }, {
          test: /\.js$/,
          loader: 'babel'
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
  ],
  node: {
    fs: "empty"
  },
  resolve: {
      alias: {
          api: ROOT + 'client/api/design',
          config: ROOT + 'client/config/design'
      }
  }
};
