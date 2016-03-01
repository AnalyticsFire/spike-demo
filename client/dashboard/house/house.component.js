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
  }

  setParam(event){
    var house_component = this,
      house = house_component.context.house,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {}, route_helper;
    update[param] = value;
    route_helper = new RouteHelper(house, house_component.props, update);
    if (route_helper.routeUpdated()){
      route_helper.updateHouseState();
      if (house_component.renders < 10){
        house_component.context.router.push(route_helper.newRoute());
        house_component.renders += 1;
      }
    }
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
  house: React.PropTypes.instanceOf(House),
  router: React.PropTypes.object.isRequired
};

export default HouseComponent;
