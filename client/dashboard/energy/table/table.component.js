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
    var tableRt = Templates.forComponent('energy_table');
    return tableRt.call(this);
  }

}

module.exports = TableComponent;
