var getbabelRelayPlugin = require('babel-relay-plugin'),
  schema = require('../data/schema.json');

module.exports = getbabelRelayPlugin(schema.data, {abortOnError: true});
