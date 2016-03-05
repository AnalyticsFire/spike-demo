# Spike

## Installing

To run the development server, you'll need node and npm. This is easiest with [nvm](https://github.com/creationix/nvm):

```sh
sudo nvm install 5.4.1
nvm use 5.4.1
```

Then install the necessary Node packages:

```sh
sudo npm install
```

## Running development server

### Setting up development database

The development server requires a Postgresql database:

```sql
CREATE DATABASE spike2;
CREATE USER spikeuser WITH PASSWORD '123456';
GRANT ALL ON DATABASE spike2 TO spikeuser;
```

The database dump can be found in the Google Drive [spike folder](https://drive.google.com/drive/u/0/folders/0B6Ys-9_Te2cFNktOU3VwSzA1VWs). Then import:

```sh
psql spike2 < spike.dump
```

### Compiling React Templates

The React views are all located in `client/dashboard`. They are organized by feature with their `scss` and React Component files. React templates have an `rt` extension. To compile them to Js code, run:

```sh
gulp compile_react_templates
```

If you're running the dev server, you'll need to run this command in another window to see the changes in the app.

### Launching express app

The dev server runs a Rest API with express and hosts the compiled assets with [Webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html). Webpack will watch imported files and refresh the page when changes are saved.

```sh
npm start
```

### Clearing data in client storage

When developing, it can be really useful to clear all of the data saved to local client storage. A better alternative to clearing all data in your browser cache, hit the 'Refresh Data' button on the main page below the houses dropdown.

## Building the design pack

To build a design pack, you first need to install [sass.js](https://github.com/medialize/sass.js/) in the design build directory so the design build can compile the sass in the browser.

```sh
cd client/build/design
git clone https://github.com/medialize/sass.js.git
```

Then build the app with webpack:

```sh
gulp build --design
```

You'll also need to download the design data in Google Drive [spike folder](https://drive.google.com/drive/u/0/folders/0B6Ys-9_Te2cFNktOU3VwSzA1VWs) and save it to `client/build/design/data`.

The design app requires no backend, just a server so files can be downloaded with jQuery. For instance with Python:

```
cd client/build/design
python -m SimpleHTTPServer 8000
python3 -m http.server
```

Access the app at localhost:8000. The app will run slowly because json responses are not as finely paginated and both React templates and sass are compiled in the browser before the app runs.

The designer can change React templates and sass files in `/dashboard`. Refresh the page to see the changes reflected. They can then share this directory with us so we can update the files in this repository.

## Testing

Tests are currently limited to critical utility functions. Integration tests, especially focused on data caching, should be added at a later more stable state.

```sh
karma start
```

## App Summary

Two main purposes for this app structure and set of dependencies:

1. Take a large dataset (the current database dump yields json responses of 500 MB) and enable the client to parse through it efficiently.
2. Bundle the app so that it can run offline and reflect changes to sass and layout files when the page is refreshed.

The functionality and structure of the app reflect usage of the following libraries:
- [LokiJs](http://lokijs.org/#/): A client side no-SQL database. Persists data in memory and can be written to browser storage with `db#save()`. The in memory data can then be cleared with `Databasable#closeDb()` - see `client/lib/databasable.js`.
- [ReactJs](https://facebook.github.io/react/).
- [History](https://github.com/mjackson/history). Javascript API for client side routing. Framework agnostic.
- [React Templates](http://wix.github.io/react-templates/): This library compiles a lightly extended HTML syntax to React Js. This is viewed as a better alternative to JSX, since it more closely reflects native HTML (see #2 above) and more easily enables separation between code and view.
- [Babel](https://babeljs.io/): Compiles ES6 (or even ES7) to ES5 for browser compatibility.
- [Webpack](https://webpack.github.io/): Javascript module bundler. Compiles dependencies and repository code to single file, which can be optimized or run in development for easy debugging. Can also compile sass assets. Configurable for different options. See `client/config/:environment/webpack.js` for our configuration files.

### Alternatives

We may also want to consider the following client side persistence, no-SQL databases:

- [localForage](http://mozilla.github.io/localForage/): Simpler key value storage. Supported by Mozilla Foundation. Elected against this primarily because it does not enable advanced querying (eg gte, lte, etc).
- [pouchdb](http://pouchdb.com/): Based on CouchDb API and intended to sync with CouchDb instances. Well supported and documented. However, data is stored and accessed directly from browser storage, rather than maintaining data in memory and explicitly persisted to browser storage (as LokiJs does). There is an in memory adapter, but this would have to be maintained as a separate pouchdb instance until the data is copied to a persistence pouchdb instance.

### Aspirations

See [Trello board](https://trello.com/b/OUlqsBo5/spike) for a to do list.

