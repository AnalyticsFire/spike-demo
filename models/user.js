import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
  connectionArgs
} from 'graphql-relay';

import DB from "./../config/database";
import {nodeInterface} from './../config/graphql/node';

const NAME = 'User';

/**
 * Sequelize Definition
 */

var User = DB.sequelize.define(NAME, {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  username: {
    type: DB.Sequelize.STRING,
    unique: true
  }
}, {
  paranoid: true,
  underscored: true,
  tableName: "users",
  instanceMethods: {

  },
  classMethods: {
    set: ()=>{
      User.associate();
      User.defineGraqhQLType()
    },
    associate: ()=>{
      User.belongsTo(DB.House);
    },
    defineGraqhQLType: ()=>{
      User.graphql_type = new GraphQLObjectType({
        name: NAME,
        description: 'A house',
        fields: () => {
          return {
            id: globalIdField(NAME),
            username: {
              type: new GraphQLNonNull(GraphQLString)
            },
            house: {
              type: DB.House.graphql_type,
              description: "Returns user's house.",
              resolve: (user, args) => {
                return user.getHouse();
              }
            }
          };
        },
        interfaces: [nodeInterface]
      });
    }
  }
});

User.name = NAME;
module.exports = User;
