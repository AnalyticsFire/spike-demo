import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

import powerRt from './power.rt.js';
import House from './../../models/house';
import SplineStackChart from './../../d3/line/spline_stack';
import DateRangeSlider from './../../d3/sliders/date_range';

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
    power.initDateRange();
    house.setPowerData().then(()=>{
      power.setState({loading_data: false});
      if (power.props.view === 'graph'){
        power.initGraph();
      }
    });
  },

  componentWillReceiveProps: function(new_props){
    var power = this;
    if (new_props.house !== power.state.house){
      // house will change.
      power.setState({loading_data: true});
      new_props.house.setPowerData().then(()=>{
        power.setState({loading_data: false});
        if (power.props.view === 'graph'){
          power.initDateRange();
          power.initGraph();
        }
      });
    }
    // view will change from graph to table.
    if (new_props.view !== 'graph' && power.props.view === 'graph') power.destroyGraph();
  },

  componentDidUpdate: function(prev_props, _prev_state){
    var power = this,
      house = power.props.house;
    // view has changed from graph to table.
    if (prev_props.view !== 'graph' && power.props.view === 'graph'){
      power.initDateRange();
      power.initGraph();
    }
  },

  initGraph: function(){
    var power = this,
      house = power.props.house;
    if (power.graph === undefined){
      power.graph = new SplineStackChart({
        container: '#power_graph',
        outer_width: 800,
        outer_height: 200,
        color: '#0404B4',
        time_series: true,
        domain_attr: 'x',
        range_attr: 'y',
        include_dots: true,
        titleizeDatum: (series, d)=>{
          return series.title + '<br/>' + Math.round(d.y) + ' W<br/>' + moment.tz(d.x.getTime(), house.timezone).format('MMM D [at] HH:mm')
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
    power.updateGraph();
  },

  updateGraph: function(){
    var power = this,
      house = power.props.house,
      net_power = {
        title: 'Net Power Consumption',
        values: house.power_data.map((power_datum)=>{
          return {
            x: house.toDate(power_datum.data.time),
            y: Math.max(0, power_datum.data.consumption - power_datum.data.production) }
        })
      },
      savings = {
        title: 'Power Production',
        values: house.power_data.map((power_datum)=>{
          return {
            x: house.toDate(power_datum.data.time),
            y: power_datum.data.production }
        })
      };
    power.graph.drawData({
      title: power.graph_title,
      css_class: '',
      series: [net_power, savings]
    });
  },

  initDateRange: function(){
    var power = this,
      house = power.props.house;
    if (power.date_range_slider === undefined){
      power.date_range_slider = new DateRangeSlider({
        container: '#power_date_setter',
        outer_height: 100,
        maxDelta: function(changed_date, other_date){
          if (Math.abs(changed_date.getTime() - other_date.getTime()) > 3600 * 24 * 7 * 1000){
            if (changed_date > other_date){
              return new Date(changed_date.getTime() - 3600 * 24 * 4 * 1000);
            } else {
              return new Date(changed_date.getTime() + 3600 * 24 * 4 * 1000);
            }
          }
          return false;
        }
      });
    }
    power.date_range_slider.onRangeUpdated = (min, max)=>{
      if (power.date_range_update) clearTimeout(power.date_range_update)
      power.date_range_update = setTimeout(()=>{
        house.power_date_range = [Math.round(min.getTime() / 1000), Math.round(max.getTime() / 1000)]
        house.setPowerData()
          .then(()=>{
            power.updateGraph();
          });
      }, 500);
    };
    var four_week_start = house.data.data_until - 3600 * 24 * 28,
      data_from = Math.max(four_week_start, house.data.data_from);
    power.date_range_slider.drawData({
      abs_min: house.toDate(four_week_start),
      abs_max: house.toDate(house.data.data_until),
      current_min: house.toDate(house.default_power_start),
      current_max: house.toDate(house.default_power_end)
    });
  },

  destroyGraph: function(){
    var power = this;
    document.getElementById('power_date_setter').innerHTML = '';
    document.getElementById('power_graph').innerHTML = '';
    power.date_range_slider = undefined;
    power.graph = undefined;
  },

  render: function() {
    return powerRt.call(this);
  }
});

export default Power;
