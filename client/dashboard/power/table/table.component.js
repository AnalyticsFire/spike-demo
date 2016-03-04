import React from 'react';
import Templates from 'config/templates';

import House from './../../../models/house';

class TableComponent extends React.Component {

  get state_manager(){
    return this.props.state_manager;
  }

  get house(){
    return this.state_manager.state.house;
  }

  render() {
    var powerTableRt = Templates.forComponent('power_table');
    return powerTableRt.call(this);
  }
}

module.exports = TableComponent;
