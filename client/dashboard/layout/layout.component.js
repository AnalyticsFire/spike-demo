import React from 'react';
import { createHistory } from 'history';

import ObjectUtil from './../../../shared/utils/object';
import Templates from 'config/templates';
import House from './../../models/house';
import PowerDatum from './../../models/power_datum';
import StateManager from './../state_manager';

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

  syncFromStateManager(fnStateSet){
    var layout = this;
    layout.setState(layout.state_manager.state, fnStateSet);
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
