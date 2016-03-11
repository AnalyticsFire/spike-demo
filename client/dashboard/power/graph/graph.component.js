import React from 'react';
import Templates from 'config/templates';
import c3 from 'c3';

import House from './../../../models/house';

class GraphComponent extends React.Component {

  get house(){
    return this.state_manager.state.house;
  }

  get state_manager(){
    return this.props.state_manager;
  }

  componentDidMount(){
    var power_graph = this;
    power_graph.updateGraph();
  }

  componentDidUpdate(prev_props, prev_state){
    var power_graph = this;
    if (prev_props.house != power_graph.props.house || prev_props.date_interval != power_graph.props.date_interval){
      power_graph.updateGraph();
    }
  }

  updateGraph(){
    var power_graph = this,
      house = power_graph.house,
      data = {
          x: 'x',
          json: house.power_data,
          keys: {
            x: 'time_to_date',
            value: ['net_consumption', 'production']
          },
          type: 'area-spline',
          groups: [['net_consumption', 'production']],
          names: {
            net_consumption: 'Net Consumption',
            production: 'Production'
          }
        };
    if (power_graph.graph === undefined){
      power_graph.chart = c3.generate({
        bindto: '#power_graph',
        data: data,
        axis: {
          x: {
            type: 'timeseries',
            tick: { format: d3.time.format('%d %B %y') }
          }
        }
      });
    } else {
      power_graph.chart.load({
        unload: true,
        data: data
      });
    }
  }

  render() {
    var powerGraphRt = Templates.forComponent('power_graph');
    return powerGraphRt.call(this);
  }

}

GraphComponent.NAME = 'PowerGraph';

module.exports = GraphComponent;
