import React from 'react';
import Templates from 'config/templates';

class TableComponent extends React.Component {

  get state_manager(){
    return this.props.state_manager;
  }

  render() {
    var irradianceTableRt = Templates.forComponent('irradiance_table');
    return irradianceTableRt.call(this);
  }
}

TableComponent.NAME = 'IrradianceTable';

module.exports = TableComponent;
