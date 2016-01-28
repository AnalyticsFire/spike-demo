import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

import DB from "./../config/database";
import {nodeInterface} from './../lib/node.relay';

/**
 * Define your own types here
 */

var House = DB.sequelize.define('House', {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  name: DB.Sequelize.STRING
}, {
  tableName: "houses", 
  instanceMethods: {

  },
  classMethods: {
    associate: ()=>{
      House.hasMany(DB.PowerDatum, {as: 'PowerData'});
    }
  }
});

House.graphql_type = new GraphQLObjectType({
  name: 'House',
  description: 'A house',
  fields: () => ({
    id: globalIdField('House'),
    name: GraphQLNonNull(GraphQLInt)
  }),
  interfaces: [nodeInterface],
});
House.name = 'House';
module.exports = House;
