import React from 'react';

import Templates from 'config/templates';
import CalendarGridChart from './../../../d3/grid/calendar_grid';
import House from './../../../models/house';

class GraphComponent extends React.Component {

  componentDidMount(){
    var energy_graph = this,
      house = energy_graph.context.house;
    if (!energy_graph.context.loading_energy_data) energy_graph.updateGraph();
  }

  componentDidUpdate(prev_props, prev_state, prev_context){
    var energy_graph = this,
      house = energy_graph.context.house;
    if (energy_graph.context.loading_energy_data) {return false;}
    if (!prev_context.house ||
        prev_context.loading_energy_data ||
        prev_context.house.id != energy_graph.context.house.id) {
      energy_graph.updateGraph();
    }
  }


  updateGraph(){
    var energy_graph = this,
      house = energy_graph.context.house,
      graph_attr = energy_graph.props.params.graph_attr;

    if (energy_graph.graph === undefined){
      energy_graph.graph = new CalendarGridChart({
        container: '#energy_graph',
        outer_width: 800,
        outer_height: 300,
        date_attr: 'day',
        color: '#0404B4',
        toDate: (energy_datum)=>{ return energy_datum.day_to_date; }
      });
      jQuery('#energy_graph').tooltip({
        selector: '.d3-chart-grid-unit',
        container: 'body',
        title: function(){
          var energy_datum = this.__data__,
            date_s = d3.time.format('%a %b %d, %Y')(energy_datum.day_to_date),
            range_value = `${Math.round(energy_datum.data[graph_attr])} kWh`;
          return `${date_s}: ${range_value}`;
        }
      });
    }

    energy_graph.graph.rangeValue = (datum)=>{ return datum.data[graph_attr]; }
    energy_graph.graph.drawData({
      title: energy_graph.graph_title,
      css_class: '',
      min_range: 0,
      max_range: 150,
      values: house.energy_data
    });
  }

  render(){
    var energyGraphRt = Templates.forComponent('energy_graph');
    return energyGraphRt.call(this);
  }

}

GraphComponent.contextTypes = {
  house: React.PropTypes.instanceOf(House),
  loading_energy_data: React.PropTypes.bool.isRequired,
  router: React.PropTypes.object.isRequired
};

export default GraphComponent;
