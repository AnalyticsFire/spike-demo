/*
 * Serve GraphQL Backend
 */

import express from 'express';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import bodyParser from 'body-parser';

import DB from './config/database';
import routes from './routes';

const API_PORT = 8080;
const APP_PORT = 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var api = express();

/*
 * Serve API App
 */

DB.sync().then(()=>{

  routes(api);

  api.use(bodyParser.json());
  api.use(bodyParser.urlencoded({ extended: false }));

  api.listen(API_PORT, () => {
    console.log(`API is now running on http://localhost:${API_PORT}`);
  });

});


/*
 * Development Server
 */

var config = require('./../client/config/development/webpack'),
  dev_server = new WebpackDevServer(webpack(config), {
    contentBase: './../client/build/development',
    publicPath: "/assets/",
    proxy: {
      '/data*': `http://localhost:${API_PORT}`,
    },
    stats: {colors: true}
  }),
  app = dev_server.app;

/*
 *  Serve Vendor Scripts, CSS, and Templates
 */

import favicon from 'serve-favicon';
import logger from 'morgan';

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

// TODO: These routes need to match references in the bootstrap and font awesome files.
app.use("/assets/fonts", express.static("bootstrap/dist/fonts"));
app.use("/assets/fonts", express.static("font-awesome/fonts"));
// serve public static files.
dev_server.app.use('/', express.static(path.resolve(__dirname, 'public')));

// view engine set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.get("*", (req, res, next)=>{
  res.render("index");
});

dev_server.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});

module.exports = app;
