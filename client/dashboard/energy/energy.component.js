import React from 'react';
import Templates from 'config/templates';
import {RouteHelper} from './../routes';

class EnergyComponent extends React.Component {

  constructor(props){
    super(props);
    var energy = this;
  }

  componentDidMount(){
    var energy = this;
  }

  componentDidUpdate(prev_props, prev_state, prev_context){
    var energy = this;
  }

  setParam(event){
    var energy = this,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {}, route_helper;
    update[param] = value;
    route_helper = new RouteHelper(energy.props, update);
    if (route_helper.routeUpdated()) route_helper.updateRoute();
  }

  render() {
    var energyRt = Templates.forComponent('energy');
    return energyRt.call(this);
  }
}

EnergyComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default EnergyComponent;
