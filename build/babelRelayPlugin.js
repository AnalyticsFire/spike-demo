var getbabelRelayPlugin = require('babel-relay-plugin'),
  schema = require('../config/graphql/schema.json');

module.exports = getbabelRelayPlugin(schema.data, {abortOnError: true});
