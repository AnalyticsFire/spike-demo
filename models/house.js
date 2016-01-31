import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
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
          var {connectionType: power_data_connection} = connectionDefinitions({name: DB.PowerDatum.name, nodeType: DB.PowerDatum.graphql_type}),
            {connectionType: habitants_connection} = connectionDefinitions({name: DB.User.name, nodeType: DB.User.graphql_type});

          return {
            id: globalIdField(NAME),
            name: {
              type: new GraphQLNonNull(GraphQLString)
            },
            power_data: {
              type: power_data_connection,
              description: "Returns house's power data.",
              args: connectionArgs,
              resolve: (house, args) => {
                return house.getPowerDataByTime(args);
              }
            },
            habitants: {
              type: habitants_connection,
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
    }
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
