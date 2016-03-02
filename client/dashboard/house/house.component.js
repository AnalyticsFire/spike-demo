import React from 'react';
import Templates from 'config/templates';
import House from './../../models/house';
import {RouteHelper} from './../routes';
import EnergyComponent from './../energy/energy.component';
import PowerComponent from './../power/power.component';

class HouseComponent extends React.Component {

  constructor(props){
    super(props);
    this.renders = 0;
    this.updates = 0;
  }

  get house(){
    return this.props.location.state && this.props.location.state.house;
  }

  setParam(event){
    var house_component = this,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {}, route_helper;
    update[param] = value;
    route_helper = new RouteHelper(house_component.props, update);
    if (route_helper.routeUpdated()) route_helper.updateRoute();
  }

  componentDidUpdate(){
    this.updates += 1;
    console.log(this.updates, ') HouseComponent#componentDidUpdate');
  }

  graphSelected(){
    var house_component = this;
    return RouteHelper.graphSelected(house_component.props.routes);
  }

  tableSelected(){
    var house_component = this;
    return RouteHelper.tableSelected(house_component.props.routes);
  }

  energySelected(){
    var house_component = this;
    return RouteHelper.energySelected(house_component.props.routes);
  }

  powerSelected(){
    var house_component = this;
    return RouteHelper.powerSelected(house_component.props.routes);
  }

  render() {
    var houseRt = Templates.forComponent('house');
    return houseRt.call(this);
  }

};

HouseComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default HouseComponent;
