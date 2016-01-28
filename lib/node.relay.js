/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */

import {
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
