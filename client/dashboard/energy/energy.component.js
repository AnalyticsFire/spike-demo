import React from 'react';
import Templates from 'config/templates';
import House from './../../models/house';
import {RouteHelper} from './../routes';

class EnergyComponent extends React.Component {

  constructor(props){
    super(props);
    var energy = this;
    energy.state = {
      loading_energy_data: true
    };
  }

  componentDidMount(){
    var energy = this,
      house = energy.context.house;
    if (!house || energy.context.loading_energy_data) return false;
    house.setEnergyData()
      .then(()=>{
        energy.setState({loading_energy_data: false});
      });
  }

  componentDidUpdate(prev_props, prev_state, prev_context){
    var energy = this,
      house = energy.context.house;
    if (!house) return false;
    if (!prev_context.house ||
        prev_context.house.data.id != energy.context.house.data.id ||
        !house.matchesYearState(prev_props.params)) {
      energy.setState({loading_energy_data: true});
      house.setEnergyData()
        .then(()=>{
          energy.setState({loading_energy_data: false}); // will update graph or table.
        });
    }
  }

  setParam(event){
    var energy = this,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {}, route_helper;
    override[param] = value;
    route_helper = new RouteHelper(energy.context.house, energy.props);
    if (route_helper.routeUpdated()){
      route_helper.updateHouseState();
      energy.context.router.push(makeRoute(house, energy.props, override));
    }
  }

  getChildContext(){
    var layout = this;
    return {
      loading_energy_data: layout.state.loading_energy_data
    };
  }

  render() {
    var energyRt = Templates.forComponent('energy');
    return energyRt.call(this);
  }
}


EnergyComponent.childContextTypes = {
  loading_energy_data: React.PropTypes.bool.isRequired
};

EnergyComponent.contextTypes = {
  house: React.PropTypes.instanceOf(House),
  router: React.PropTypes.object.isRequired
};

export default EnergyComponent;
