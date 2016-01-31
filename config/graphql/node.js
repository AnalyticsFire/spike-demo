import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    return null;
  },
  (obj) => {
    if (obj instanceof Array) {
      return Array;
    } else {
      return null;
    }
  }
);

export {nodeInterface, nodeField};
