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
    if (new_props.view !== 'graph' && power.props.view === 'graph') power.destroyGraph();
  },

  componentDidUpdate: function(prev_props, _prev_state){
    var power = this,
      house = power.props.house;
    if (prev_props.view !== 'graph' && power.props.view === 'graph') power.initGraph();
  },

  initGraph: function(){
    var power = this;
    if (power.graph === undefined){
      power.graph = new SplineStackChart({
        container: '#power_graph',
        outer_width: 800,
        outer_height: 200,
        color: '#0404B4',
        range_attr: 'y',
        domain_attr: 'x',
        time_series: true
      });
      jQuery('#power_graph').tooltip({
        selector: 'path',
        container: 'body',
        title: function(){
          return this.__data__.title;
        }
      });
    }
    power.updateGraph();
  },

  updateGraph: function(){
    var power = this,
      house = power.props.house,
      net_power = {
        title: 'Net Power Consumption',
        values: house.power_data.slice(0, 200).map((power_datum)=>{ return {y: Math.max(0, power_datum.data.consumption - power_datum.data.production), x: power_datum.data.time.toDate() } })
      },
      savings = {
        title: 'Power Production',
        values: house.power_data.slice(0, 200).map((power_datum)=>{ return {y: power_datum.data.production, x: power_datum.data.time.toDate() } })
      };
    power.graph.drawData({
      title: power.graph_title,
      css_class: '',
      series: [net_power, savings]
    });
  },

  destroyGraph: function(){
    var power = this;
    document.getElementById('power_graph').innerHTML = '';
    power.graph = undefined;
  },

  render: function() {
    return powerRt.call(this);
  }
});

export default Power;
