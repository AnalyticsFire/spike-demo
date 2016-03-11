import React from 'react';
import Templates from 'config/templates';

class IrradianceComponent extends React.Component {

  get state_manager(){
    return this.props.state_manager;
  }

  render() {
    var irradianceRt = Templates.forComponent('irradiance');
    return irradianceRt.call(this);
  }

}
IrradianceComponent.NAME = 'Irradiance';

module.exports = IrradianceComponent;
