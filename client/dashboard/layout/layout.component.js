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
      loading_house_data: true
    };
    this.updates = 0
  }

  get house(){
    return this.props.location.state && this.props.location.state.house;
  }

  componentDidMount() {
    var layout = this;
    House.ensureHouses().then((houses)=>{
      var house = null;
      if (layout.props.params.house_id != undefined){
        house = houses.find((h)=>{ return h.data.id == layout.props.params.house_id; });
      }
      layout.setState({
        houses: houses,
        loading_house_data: false
        }, ()=>{
          if (house){
            var route_helper = new RouteHelper(layout.context.router, layout.props, {house: house});
            route_helper.updateRoute();
          }
        });
    });
  }

  componentDidUpdate(){
    var layout = this;

    this.updates += 1;
    console.log(this.updates, ') LayoutComponent#componentDidUpdate');
  }

  setHouse(event){
    var layout = this,
      house_id = event.target.value;
    if (!layout.house || layout.house.id != house_id){
      House.ensureHouses().then((houses)=>{
        var new_house = houses.find((h)=>{ return h.data.id == house_id }),
          route_helper = new RouteHelper(layout.context.router, layout.props, {house: new_house});
        route_helper.updateRoute();
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

  render() {
    var layoutRt = Templates.forComponent('layout');
    return layoutRt.call(this);
  }
}

LayoutComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default LayoutComponent;
