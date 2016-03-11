import React from 'react';
import { createHistory } from 'history';

import ObjectUtil from './../../../shared/utils/object';
import Templates from 'config/templates';
import House from './../../models/house';
import PowerDatum from './../../models/power_datum';
import StateManager from './../state_manager';
import DateRangeSlider from './../../d3/sliders/date_range';

class LayoutComponent extends React.Component {

  constructor(props, context){
    super(props, context);
    var layout = this;
    layout.state = {
      loading_houses: true,
      houses: null,
      house: null,
      dataset: null,
      year: null,
      month: null,
      date_interval: null,
      view: null
    }
  }

  get house(){
    return this.state_manager && this.state_manager.state.house;
  }

  get should_show_energy_data(){
    return this.state.dataset === 'energy' && this.house && this.house.energy_data;
  }

  get should_show_power_data(){
    return this.state.dataset === 'power' && this.house && this.house.power_data;
  }

  componentDidMount() {
    var layout = this;
    House.ensureHouses().then((houses)=>{
      var house = null;
      layout.setState({
          houses: houses,
          loading_houses: false
        }, ()=>{
          layout.state_manager = new StateManager(layout.props.createHistory, houses);
          layout.state_manager.history.listen((location)=>{
            layout.state_manager.updateStateFromUrl(location, layout);
          });
        });
    });
  }

  componentDidUpdate(prev_props, prev_state){
    var layout = this;
    if (layout.shouldShowDateRange() && !layout.datesMatch(prev_state)){
      layout.updateDateRange();
    } else if (!layout.shouldShowDateRange()){
      layout.destroyDateRange();
    }
  }

  datesMatch(prev_state){
    var layout = this;
    return layout.state.month == prev_state.month &&
        layout.state.year == prev_state.year &&
        !layout.shouldShowDateRange() ||
        layout.state.date_interval && prev_state.date_interval &&
        layout.state.date_interval[0] == prev_state.date_interval[0] &&
        layout.state.date_interval[1] == prev_state.date_interval[1];
  }

  shouldShowDateRange(){
    var layout = this;
    return layout.state.house && layout.state.dataset === 'power' || layout.state.dataset === 'irradiance';
  }

  syncFromStateManager(fnStateSet){
    var layout = this;
    layout.setState(layout.state_manager.state, ()=>{
      fnStateSet()
    });
  }

  setHouse(event){
    var layout = this,
      house_id = event.target.value;
    if (layout.state_manager.state.house_id == house_id) return false;
    layout.state_manager.setParams({house_id: house_id}, layout);
  }

  setParam(event){
    var layout = this,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {};
    update[param] = value;
    if (value == layout.state_manager.state[param]) return false;
    layout.state_manager.setParams(update, layout);
  }

  destroyDateRange(){
    var layout = this,
      container = document.getElementById('date_interval');
    if (container) container.innerHTML = '';
    layout.date_interval_slider = undefined;
  }

  updateDateRange(){
    var layout = this,
      house = layout.house,
      state_manager = layout.state_manager;
    if (layout.date_interval_slider === undefined){
      layout.date_interval_slider = new DateRangeSlider({
        container: '#date_interval',
        outer_height: 100,
        maxDelta: function(changed_date, other_date){
          if (Math.abs(changed_date.getTime() - other_date.getTime()) > House.MAX_POWER_RANGE * 1000){
            if (changed_date > other_date){
              return new Date(changed_date.getTime() - House.MAX_POWER_RANGE * 1000);
            } else {
              return new Date(changed_date.getTime() + House.MAX_POWER_RANGE * 1000);
            }
          }
          return false;
        }
      });
    }
    layout.date_interval_slider.onRangeUpdated = (min, max)=>{
      if (layout.date_interval_update) clearTimeout(layout.date_interval_update);
      // This will update the URL -> state_manager.state -> component states.
      layout.date_interval_update = setTimeout(()=>{
        var date_interval = [Math.round(min.getTime() / 1000), Math.round(max.getTime() / 1000)];
        layout.state_manager.setParams({date_interval: date_interval}, layout);
      }, 500);
    };
    var month_range = state_manager.month_range;
    layout.date_interval_slider.drawData({
      abs_min: house.toDate(month_range[0]),
      abs_max: house.toDate(month_range[1]),
      current_min: house.toDate(state_manager.state.date_interval[0]),
      current_max: house.toDate(state_manager.state.date_interval[1])
    });
  }

  refreshData(){
    var layout = this,
      houses = layout.state.houses,
      all = [];
    houses.forEach((house)=>{
      all.push(house.clearData());
    });
    Promise.all(all)
      .then(()=>{
        window.location.reload();
      });
  }

  render() {
    var layoutRt = Templates.forComponent('layout');
    return layoutRt.call(this);
  }
}

LayoutComponent.NAME = 'Layout';

module.exports = LayoutComponent;
