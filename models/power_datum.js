import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

import Database from "./../config/database";
import PowerData from "./house"

/**
 * Define your own types here
 */

var PowerDatum = Database.sequelize.define('Datum', {
  id: {
    type: Database.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  time: Database.Sequelize.FLOAT,
  power: Database.Sequelize.FLOAT
}, {
  tableName: "power_data", 
  instanceMethods: {

  },
  classMethods: {
    associate: function(){
      PowerDatum.belongsTo(House);
    }
  }
});


PowerDatum.graphql_type = new GraphQLObjectType({
  name: 'Power Datum',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('PowerDatum'),
    time: GraphQLInt,
    power: GraphQLFloat
  }),
  interfaces: [nodeInterface],
});

export PowerDatum;
