import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

import Templates from 'config/templates';
import House from './../../models/house';

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

  syncFromStateManager(fnStateSet){
    var power = this;
    power.setState(power.state_manager.state, fnStateSet);
  }

  render() {
    var powerRt = Templates.forComponent('power');
    return powerRt.call(this);
  }

}

PowerComponent.NAME = 'Power';

module.exports = PowerComponent;
