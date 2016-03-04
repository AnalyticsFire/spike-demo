import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

import Templates from 'config/templates';
import House from './../../models/house';
import DateRangeSlider from './../../d3/sliders/date_range';

class PowerComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading_power_data: false,
      house: null,
      power_range: null
    };
  }

  get house(){
    return this.state_manager && this.state_manager.state && this.state_manager.state.house;
  }

  get state_manager(){
    return this.props.state_manager;
  }

  get loading_power_data(){
    return this.props.loading_power_data || this.state.loading_power_data;
  }

  componentDidMount(){
    var power = this;
    power.initDateRange();
  }

  componentDidUpdate(prev_props, prev_state){
    var power = this,
      state_manager = power.state_manager;
    if (prev_props.month != power.props.month ||
        prev_props.year != power.props.year ||
        prev_props.house != power.props.house){
      power.initDateRange();
      state_manager.powerDataRendered();
    }
  }

  syncFromStateManager(fnStateSet){
    var power = this;
    power.setState(power.state_manager.state, fnStateSet);
  }

  initDateRange(){
    var power = this,
      house = power.house;
    if (power.date_range_slider === undefined){
      power.date_range_slider = new DateRangeSlider({
        container: '#power_date_setter',
        outer_height: 100,
        maxDelta: function(changed_date, other_date){
          if (Math.abs(changed_date.getTime() - other_date.getTime()) > 3600 * 24 * 4 * 1000){
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
      if (power.date_range_update) clearTimeout(power.date_range_update);
      power.date_range_update = setTimeout(()=>{
        var power_range = [Math.round(min.getTime() / 1000), Math.round(max.getTime() / 1000)];
        power.state_manager.setParams({power_range: power_range}, power);
      }, 500);
    };
    power.date_range_slider.drawData({
      abs_min: house.state.current_month_moment.toDate(),
      abs_max: house.state.end_of_current_data_moment.toDate(),
      current_min: house.toDate(house.state.power_range[0]),
      current_max: house.toDate(house.state.power_range[1])
    });
  }

  setParam(event){
    var power = this,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {}, route_helper;
    update[param] = value;
    if (value == power.state_manager.state[param]) return false;
    power.state_manager.setParams(update, power);
  }

  render() {
    var powerRt = Templates.forComponent('power');
    return powerRt.call(this);
  }

}

PowerComponent.NAME = 'PowerComponent'

module.exports = PowerComponent
