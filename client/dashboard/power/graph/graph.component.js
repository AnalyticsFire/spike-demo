import React from 'react';
import Templates from 'config/templates';

import House from './../../../models/house';
import SplineStackChart from './../../../d3/line/spline_stack';

class GraphComponent extends React.Component {

  componentDidMount(){
    var power_graph = this,
      house = power_graph.context.house;
    power_graph.graph_title = ' ';
    if (!power_graph.context.loading_power_data) power_graph.updateGraph();
  }

  componentDidUpdate(prev_props, prev_state, prev_context){
    var power_graph = this,
      house = power_graph.context.house;
    if (power_graph.context.loading_power_data) {return false;}
    if (!prev_context.house ||
        prev_context.loading_power_data ||
        prev_context.house.id != power_graph.context.house.id) {
      power_graph.updateGraph();
    }
  }

  updateGraph(){
    var power_graph = this,
      house = power_graph.context.house;
    if (power_graph.graph === undefined){
      power_graph.graph = new SplineStackChart({
        container: '#power_graph',
        outer_width: 800,
        outer_height: 200,
        color: '#0404B4',
        time_series: true,
        domain_attr: 'x',
        range_attr: 'y',
        include_dots: true,
        titleizeDatum: (series, d)=>{
          return series.title + '<br/>' + Math.round(d.y) + ' W<br/>' + house.formatDate(d.power_graph_datum.data.time, 'MMM D [at] HH:mm');
        }
      });
      jQuery('#power_graph').tooltip({
        selector: 'circle',
        container: 'body',
        html: true,
        title: function(){
          return this.__data__.title;
        }
      });
    }
    var net_power_graph = {
        title: 'Net Power Consumption',
        values: house.power_data.map((power_graph_datum)=>{
          return {
            power_graph_datum: power_graph_datum,
            x: power_graph_datum.time_to_date,
            y: Math.max(0, power_graph_datum.data.consumption - power_graph_datum.data.production) }
        })
      },
      savings = {
        title: 'Power Production',
        values: house.power_data.map((power_graph_datum)=>{
          return {
            power_graph_datum: power_graph_datum,
            x: power_graph_datum.time_to_date,
            y: power_graph_datum.data.production }
        })
      };
    power_graph.graph.drawData({
      title: power_graph.graph_title,
      css_class: '',
      series: [net_power_graph, savings]
    });
  }

  render() {
    var powerGraphRt = Templates.forComponent('power_graph');
    return powerGraphRt.call(this);
  }

}

GraphComponent.contextTypes = {
  house: React.PropTypes.instanceOf(House),
  loading_power_data: React.PropTypes.bool.isRequired,
  router: React.PropTypes.object.isRequired
};

export default GraphComponent;
