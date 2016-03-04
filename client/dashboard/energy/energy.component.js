import React from 'react';
import Templates from 'config/templates';

class EnergyComponent extends React.Component {

  constructor(props){
    super(props);
  }

  get state_manager(){
    return this.props.state_manager;
  }

  get loading_energy_data(){
    return this.props.loading_energy_data;
  }

  syncFromStateManager(fnStateSet){
    var energy = this;
    energy.setState(energy.state_manager.state, fnStateSet);
  }

  setParam(event){
    var energy = this,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {};
    update[param] = value;
    if (value == energy.state_manager.state[param]) return false;
    energy.state_manager.setParams(update, energy);
  }

  render() {
    var energyRt = Templates.forComponent('energy');
    return energyRt.call(this);
  }
}
EnergyComponent.NAME = 'EnergyComponent'

module.exports = EnergyComponent;
