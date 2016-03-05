// Require babel polyfill for browser.
require('babel-polyfill');

var testsContext = require.context('./spec', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);

require('./client/models/house');
require('./shared/utils/date_range');
