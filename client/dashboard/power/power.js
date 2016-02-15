import React from 'react';
import powerRt from './power.rt.js';
import House from './../../models/house';
import SplineStackChart from './../../d3/line/spline_stack';

var Power = React.createClass({

  getInitialState: function(){
    var power = this;
    return {
      loading_data: true
    };
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    // window.addEventListener('resize', this.handleResize);
    var power = this,
      house = power.props.house;
    power.graph_title = '';
    house.ensurePowerData().then(()=>{
      power.setState({loading_data: false});
      if (power.props.view === 'graph') power.initGraph();
    });
  },

  componentWillReceiveProps: function(new_props){
    var power = this;
    if (new_props.house !== power.state.house){
      power.setState({loading_data: true});
      new_props.house.ensurePowerData().then(()=>{
        power.setState({loading_data: false});
        if (power.props.view === 'graph') power.initGraph();
      });
    }
  },

  componentDidUpdate: function(prev_props, _prev_state){
    var power_datum = this,
      house = power.props.house;
    if (prev_props.view !== 'graph' && power.props.view === 'graph') power.initGraph();
  },

  initGraph: function(){
    var power = this;
    if (power.graph === undefined){
      document.getElementById('power_graph').innerHTML = '';
      power.graph = new SplineStackChart({
        container: '#power_graph',
        outer_width: 800,
        outer_height: 200,
        date_attr: 'day',
        color: '#0404B4',
        toDate: (power_datum)=>{ return power_datum.data.day.toDate(); }
      });
      jQuery('#power_graph').tooltip({
        selector: '.d3-chart-grid-unit',
        container: 'body',
        title: function(){
          var power_datum = this.__data__,
            date_s = d3.time.format('%a %b %d, %Y')(power_datum.data.day.toDate()),
            range_value = `${Math.round(power_datum.data[power.state.graph_attr])} kWh`;
          return `${date_s}: ${range_value}`;
        }
      });
    }
    power.updateGraph();
  },

  updateGraph: function(){
    var power = this,
      house = power.props.house;
    power.graph.rangeValue = (datum)=>{ return datum.data[power.state.graph_attr]; }
    power.graph.drawData({
      title: power.graph_title,
      css_class: '',
      min_range: 0,
      max_range: 150,
      values: house.power_data
    });
  },

  render: function() {
    return powerRt.call(this);
  }
});

export default Power;
