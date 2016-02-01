/*
 * Serve GraphQL Backend
 */

import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import schema from './config/graphql/schema';

import DB from './config/database';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

var graphql_server = express();

DB.sync.then(()=>{
  // Expose a GraphQL endpoint
  graphql_server.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: schema(),
  }));
  graphql_server.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
  ));
});

/*
 * Compile and Serve Relay App w/ Webpack
 */

var compiler = webpack({
  entry: {
    app: path.resolve(__dirname, 'relay', 'application.js')
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['./build/babelRelayPlugin'],
        },
        test: /\.js$/
      }
    ]
  },
  output: {filename: 'application.js', path: '/'}
});
var dev_server = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/assets/js/',
  stats: {colors: true}
});

/*
 * Logging, Cookie, JSON Parsing Middleware
 *

import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'bodyParser';

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());*/

/*
 *  Serve Vendor Scripts, CSS, and Templates
 */

// serve fonts in /assets/fonts
import assets from "connect-assets";
dev_server.app.use("/assets/fonts", express.static("node_modules/bootstrap/dist/fonts"));
dev_server.app.use("/assets/fonts", express.static("node_modules/font-awesome/fonts"));
// serve compiled vendor assets and application.css.
dev_server.app.use(assets({
  paths: ["assets/js", "assets/css", "node_modules"],
  build: true,
  buildDir: false,
  //compile: false,
  compress: true
}));
// serve public static files.
dev_server.app.use('/', express.static(path.resolve(__dirname, 'public')));

// view engine set up
dev_server.app.set('views', path.join(__dirname, 'views'));
dev_server.app.set('view engine', 'jade');
dev_server.app.get("/", (req, res, next)=>{
  res.render("index");
});

dev_server.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});

/*
 * Handle Errors
 */

// catch 404 and forward to error handler
dev_server.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
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
});*/


module.exports = dev_server;
