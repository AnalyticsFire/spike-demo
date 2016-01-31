import React from 'react';
import Relay from 'react-relay';

import DB from './../../config/database'

class App extends React.Component {
  render() {
    var viewer = this.props.viewer,
      house = viewer.house.edge.node;
    return (
      <div>
        <h1>Hi, {viewer.username}</h1>
        <p>You are living in the {house.name} house!!!!</p>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on ${DB.User.name} {
        username
        house {
          edge {
            node {
              name
            }
          }
        }
      }
    `,
  },
});
