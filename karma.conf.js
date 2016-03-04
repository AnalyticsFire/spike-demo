var path = require('path');

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    //coverageReporter: {
    //  reporters: [
    //    { type: 'html', subdir: 'html' },
    //    { type: 'lcovonly', subdir: '.' },
    //  ],
    // },
    files: [
      'tests.webpack.js',
    ],
    frameworks: [
      'jasmine',
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap'],
    },
    reporters: ['progress'],
    webpack: {
      cache: true,
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.test\.js$/,
            include: /spec/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              cacheDirectory: true,
            },
          }/*, {
            test: /\.js?$/,
            include: /(client|shared)/,
            exclude: /(node_modules|spec)/,
            loader: 'babel-istanbul',
            query: {
              cacheDirectory: true,
            },
          }*/
        ],
        loaders: [
          {
            test: /\.js$/,
            include: /(client|shared)/,
            exclude: /(node_modules|spec)/,
            loader: 'babel',
            query: {
              cacheDirectory: true,
            },
          }, {
            test: /\.json$/,
            loader: 'json'
          }
        ],
      },
      resolve: {
        alias: {
          api: __dirname + '/client/api/development',
          config: __dirname + '/client/config/development'
        }
      }
    },
  });
};
