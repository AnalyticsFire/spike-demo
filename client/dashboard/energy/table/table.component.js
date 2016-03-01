import React from 'react';
import Templates from 'config/templates';

import House from './../../../models/house';

class TableComponent extends React.Component {

  render() {
    var tableRt = Templates.forComponent('energy_table');
    return tableRt.call(this);
  }

}

TableComponent.contextTypes = {
  house: React.PropTypes.instanceOf(House),
  router: React.PropTypes.object.isRequired
};

export default TableComponent;
