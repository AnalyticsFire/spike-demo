import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    var viewer = this.props.viewer,
      house = viewer.house;
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
      fragment on User {
        username
        house {
          name
        }
      }
    `,
  },
});
