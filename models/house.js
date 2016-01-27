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

import Database from "./../config/database";
import PowerData from "./power_datum"

/**
 * Define your own types here
 */

var House = Database.sequelize.define('House', {
  id: {
    type: Database.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  name: Database.Sequelize.STRING
}, {
  tableName: "houses", 
  instanceMethods: {

  },
  classMethods: {
    associate: function(){
      House.hasMany(PowerDatum, {as: 'PowerData'})
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

export House;
