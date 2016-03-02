import React from 'react';
import Templates from 'config/templates';

import House from './../../../models/house';

class TableComponent extends React.Component {

  render() {
    var powerTableRt = Templates.forComponent('power_table');
    return powerTableRt.call(this);
  }
}

TableComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default TableComponent;
