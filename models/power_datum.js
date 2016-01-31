import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import DB from "./../config/database";
import {nodeInterface} from './../config/graphql/node';

const NAME = 'PowerDatum'

/**
 * Define your own types here
 */

var PowerDatum = DB.sequelize.define(NAME, {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  time: DB.Sequelize.DATE,
  power: DB.Sequelize.FLOAT
}, {
  paranoid: true,
  underscored: true,
  tableName: "power_data",
  instanceMethods: {

  },
  classMethods: {
    set: ()=>{
      PowerDatum.associate();
      PowerDatum.defineGraphQLType();
    },
    associate: ()=>{
      PowerDatum.belongsTo(DB.House);
    },
    defineGraphQLType: ()=>{
      PowerDatum.graphql_type = new GraphQLObjectType({
        name: NAME,
        description: 'A person who uses our app',
        fields: () => ({
          id: globalIdField(NAME),
          power: {
            type: GraphQLFloat,
          },
          time: {
            type: GraphQLInt,
            description: "Time the power was recorded.",
            resolve: (power_datum, _) => {
              return power_datum.time.getTime();
            }
          },
        }),
        interfaces: [nodeInterface]
      });
    }
  }
});

PowerDatum.name = NAME;
module.exports = PowerDatum;
