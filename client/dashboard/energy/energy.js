import React from 'react';
import Templates from 'config/templates';
import House from './../../models/house';
import CalendarGridChart from './../../d3/grid/calendar_grid';

var Energy = React.createClass({

  getInitialState: function(){
    var energy = this;
    return {
      graph_attr: 'production',
      loading_data: true
    };
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    // window.addEventListener('resize', this.handleResize);
    var energy = this,
      house = energy.props.house;
    energy.graph_title = 'Daily Consumption';
    house.setEnergyData().then(()=>{
      energy.setState({loading_data: false});
      if (energy.props.view === 'graph') energy.initGraph();
    });
  },

  componentWillReceiveProps: function(new_props){
    var energy = this;
    if (new_props.house !== energy.props.house){
      energy.setState({loading_data: true});
      new_props.house.setEnergyData().then(()=>{
        energy.setState({loading_data: false});
        if (energy.props.view === 'graph') energy.initGraph();
      });
    }
    if (new_props.view !== 'graph' && energy.props.view === 'graph') energy.destroyGraph();
  },

  componentDidUpdate: function(prev_props, _prev_state){
    var energy = this,
      house = energy.props.house;
    if (prev_props.view !== 'graph' && energy.props.view === 'graph') energy.initGraph();
    if (prev_props.year !== energy.props.year){
      energy.updateCurrentMonth();
    }
  },

  setGraphAttr: function(event){
    var energy = this,
      graph_attr = event.target.dataset.value;
    if (graph_attr !== energy.state.graph_attr){
      energy.graph_title = 'Daily ' + event.target.innerText;
      energy.setState({
        graph_attr: graph_attr
      }, function(){
        if (energy.props.view === 'graph') energy.updateGraph();
      })
    }
  },

  initGraph: function(){
    var energy = this;
    if (energy.graph === undefined){
      energy.graph = new CalendarGridChart({
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
            range_value = `${Math.round(energy_datum.data[energy.state.graph_attr])} kWh`;
          return `${date_s}: ${range_value}`;
        }
      });
    }
    energy.updateGraph();
  },

  updateGraph: function(){
    var energy = this,
      house = energy.props.house;
    energy.graph.rangeValue = (datum)=>{ return datum.data[energy.state.graph_attr]; }
    energy.graph.drawData({
      title: energy.graph_title,
      css_class: '',
      min_range: 0,
      max_range: 150,
      values: house.energy_data
    });
  },

  destroyGraph: function(){
    var energy = this;
    document.getElementById('energy_graph').innerHTML = '';
    energy.graph = undefined;
  },

  updateCurrentMonth: function(){
    var energy = this,
      house = energy.props.house;
    house.setEnergyData()
      .then(()=>{
        if (energy.props.view === 'graph'){
          // no update necessary since year already updated in layout.rt.
          energy.updateGraph();
        } else {
          // force update to render correct data in table.
          energy.forceUpdate();
        }
      });
  },

  render: function() {
    var energyRt = Templates.forComponent('energy');
    return energyRt.call(this);
  }
});

export default Energy;
