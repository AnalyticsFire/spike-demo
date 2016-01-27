import React from 'react';
import Relay from 'react-relay';

class PowerTimeSeries extends React.Component {

  get timeframes(){
    return [
      {display: "Today", value: 'today'},
      {display: "1 week", value: 'week'},
      {display: "1 month", value: 'month'},
      {display: "6 months", value: 'half_year'},
      {display: "1 year", value: 'year'}
    ];
  }

  render() {
    var power_time_series = this;
    return (
      <div>
        <h1>Power Time Series</h1>
        <ul>
          {power_time_series.props.viewer.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
        <div class="spk-power-time-series-timeframes">
          {power_time_series.timeframes.map(timeframe =>
            <div data-value="{timeframe.value}" class="spk-power-time-series-timeframe">{timeframe.display}</div>
          )}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(PowerTimeSeries, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
      }
    `,
  },
});
