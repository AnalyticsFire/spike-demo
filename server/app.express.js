/*
 * Serve GraphQL Backend
 */

import express from 'express';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import schema from './config/graphql/schema';

import DB from './config/database';
import routes from './routes';

const APP_PORT = 3000;
const JS_PORT = 3000;

var app = express();

DB.sync().then(()=>{

routes(app);

/*
 * Logging, Cookie, JSON Parsing Middleware
 */

import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'bodyParser';

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 *  Serve Vendor Scripts, CSS, and Templates
 */

// serve fonts in /assets/fonts
import assets from "connect-assets";
app.use("/assets/fonts", express.static("node_modules/bootstrap/dist/fonts"));
app.use("/assets/fonts", express.static("node_modules/font-awesome/fonts"));
// serve compiled vendor assets and application.css.
app.use(assets({
  paths: ["./assets/js", "./assets/css", "./../node_modules"],
  build: true,
  buildDir: false,
  //compile: false,
  compress: true
}));
// serve public static files.
dev_server.app.use('/', express.static(path.resolve(__dirname, 'public')));

// view engine set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.get("/", (req, res, next)=>{
  res.render("index");
});

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});

/*
 * Handle Errors
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

});

/*
 * Development Server
 */

import ExtractTextPlugin from "extract-text-webpack-plugin";

var compiler = webpack({
  entry: {
    app: __dirname + '/../client/app.js',
    style: __dirname + '/../client/style.scss'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/../client/build'
  },
  externals: {
    jquery: "$",
    d3: "d3"
  },
  module: {
      loaders: [
          {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
          }, {
              test: /\.css$/,
              loader: ExtractTextPlugin.extract("style-loader", "css-loader")
          }
      ]
  },
  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
      new ExtractTextPlugin("style.css", {
        allChunks: true
      })
  ]
});


var dev_server = new WebpackDevServer(compiler, {
  contentBase: __dirname + '/../client/build',
  publicPath: "/assets/",
  proxy: {
    '/data': `http://localhost:${APP_PORT}`
  },
  stats: {colors: true}
});


module.exports = app;
