import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
  connectionArgs
} from 'graphql-relay';

import extend from 'extend';
import DB from "./../config/database";
import {nodeInterface} from './../config/graphql/node';

const NAME = 'House';

/**
 * Sequelize Definition
 */

var House = DB.sequelize.define(NAME, {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  name: DB.Sequelize.STRING
}, {
  paranoid: true,
  underscored: true,
  tableName: "houses",
  instanceMethods: {

  },
  classMethods: {
    set: ()=>{
      House.associate();
      House.defineGraphQLType();
    },
    associate: ()=>{
      House.hasMany(DB.PowerDatum, {as: 'PowerData'});
      House.hasMany(DB.User, {as: 'Habitants'});
    },
    defineGraphQLType: ()=>{
      House.graphql_type = new GraphQLObjectType({
        name: NAME,
        description: 'A house',
        fields: () => {
          return {
            id: globalIdField(NAME),
            name: {
              type: new GraphQLNonNull(GraphQLString)
            },
            power_data: {
              type: new GraphQLList(DB.PowerDatum.graphql_type),
              description: "Returns house's power data.",
              args: connectionArgs,
              resolve: (house, args) => {
                return house.getPowerDataByTime(args);
              }
            },
            habitants: {
              type: new GraphQLList(DB.User.graphql_type),
              description: "Returns list of house's habitants.",
              args: connectionArgs,
              resolve: (house, args) => {
                var params = extend({
                  order: 'name ASC',
                  limit: 50,
                  offset: 0,
                }, args);
                delete params.where; // don't allow any additional query params.
                return house.getHabitants(params);
              }
            }
          };
        },
        interfaces: [nodeInterface]
      });
    },
    getPowerDataByTime: (start_date, end_date, page)=>{
      var params = extend({
        order: 'time ASC',
        limit: 500
      }, args.page);
      params.where = {time: {}};
      if (start_date) params.where.time.$gt = moment.utc(start_date).toDate();
      if (end_date) params.where.time.$lt = moment.utc(end_date).toDate();

      return House.getPowerData(params);
    }
  }
});

House.name = NAME;
module.exports = House;
