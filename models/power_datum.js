import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';

import {
  fromGlobalId,
  globalIdField
} from 'graphql-relay';

import DB from "./../config/database";
import {nodeInterface} from './../lib/node.relay';

/**
 * Define your own types here
 */

var PowerDatum = DB.sequelize.define('PowerDatum', {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  time: DB.Sequelize.DATE,
  power: DB.Sequelize.FLOAT
}, {
  tableName: "power_data",
  instanceMethods: {

  },
  classMethods: {
    associate: ()=>{
      PowerDatum.belongsTo(DB.House);
    }
  }
});

PowerDatum.graphql_type = new GraphQLObjectType({
  name: 'PowerDatum',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('PowerDatum'),
    time: GraphQLInt,
    power: GraphQLFloat
  }),
  interfaces: [nodeInterface],
});
PowerDatum.name = 'PowerDatum';

module.exports = PowerDatum;
