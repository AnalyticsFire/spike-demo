import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import DB from './../database'

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {graphql_type_name, id} = fromGlobalId(globalId),
      model = DB[graphql_type_name];
    return model.findOne({where: {id: id}});
  },
  (instance) => {
    return instance.Model().graphql_type;
  }
);

export {nodeInterface, nodeField};
