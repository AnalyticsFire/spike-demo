import React from 'react';
import Templates from 'config/templates';
import House from './../../models/house';
import PowerDatum from './../../models/power_datum';
import {RouteHelper} from './../routes';

class LayoutComponent extends React.Component {

  constructor(props, context){
    super(props, context);
    this.renders = 0;
    this.state = {
      houses: null,
      house: null,
      requesting_data: true
    };
  }

  componentDidMount() {
    var layout = this;
    House.ensureHouses().then((houses)=>{
      var house = null;
      if (layout.props.params.house_id != undefined){
        house = houses.find((h)=>{ return h.data.id == layout.props.params.house_id; });
        var route_helper = new RouteHelper(house, layout.props);
        if (route_helper.paramsHaveDateState()) route_helper.updateHouseToParams();
      }
      layout.setState({
        houses: houses,
        requesting_data: false,
        house: house });
    });
  }

  setHouse(event){
    var layout = this,
      house_id = event.target.value,
      old_house = layout.state.house,
      house = layout.state.houses.find((house)=>{ return house.data.id == house_id });
    if (!old_house || old_house.id != house_id){
      var route_helper = new RouteHelper(house, layout.props);
      route_helper.updateHouseToParams();
      layout.setState({house: house}, ()=>{
        if (layout.renders < 10){
          layout.context.router.push(route_helper.newRoute());
          layout.renders += 1
        }
        if (old_house) old_house.closeDb();
      });
    }
  }

  refreshData(){
    var layout = this,
      houses = layout.state.houses,
      all = [];
    houses.forEach((house)=>{
      all.push(house.clearData());
    });
    Promise.all(all)
      .then(()=>{
        window.location.reload();
      });
  }

  getChildContext(){
    var layout = this;
    return {house: layout.state.house};
  }

  render() {
    var layoutRt = Templates.forComponent('layout');
    return layoutRt.call(this);
  }
}

LayoutComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

LayoutComponent.childContextTypes = {
  house: React.PropTypes.instanceOf(House)
};
export default LayoutComponent;
