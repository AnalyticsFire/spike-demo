import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import {nodeField} from './node';
import DB from './../database';

export default function(){

  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeField,
      viewer: {
        type: DB.User.graphql_type,
        resolve: (_, args) => {
          return DB.User.findOne({where: {username: args.username}});
        }
      },
    }),
  });

  return new GraphQLSchema({
    query: queryType
  });
}
