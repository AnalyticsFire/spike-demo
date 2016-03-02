import House from './house/house.component'
import Power from './power/power.component';
import PowerGraph from './power/graph/graph.component';
import PowerTable from './power/table/table.component';
import Energy from './energy/energy.component';
import EnergyGraph from './energy/graph/graph.component';
import EnergyTable from './energy/table/table.component';
import About from './about/about.component';
import Layout from './layout/layout.component';
import ArrayUtil from './../../shared/utils/array';

const POWER_ROUTES = {
  path: 'power',
  component: Power,
  childRoutes: [
    {path: ':month/:year', component: PowerGraph},
    {path: ':month/:year/graph', component: PowerGraph},
    {path: ':month/:year/table', component: PowerTable}
  ]
};

const ENERGY_ROUTES = {
  path: 'energy',
  component: Energy,
  childRoutes: [
    {path: ':year/:graph_attr', component: EnergyGraph},
    {path: ':year/:graph_attr/graph', component: EnergyGraph},
    {path: ':year/:graph_attr/table', component: EnergyTable}
  ]
};

export const ROUTES = [{
  path: '/',
  component: Layout,
  indexRoute: { component: About },
  childRoutes: [{
      path: 'houses/:house_id',
      component: House,
      childRoutes: [ENERGY_ROUTES, POWER_ROUTES]
  }]
}];

export class RouteHelper {

  constructor(router, props, update){
    update = update || {};
    var route_helper = this;
    route_helper.props = props;
    route_helper.router = router;
    route_helper.update = update || {};
  }

  get house(){
    var route_helper = this;
    return route_helper.update.house || route_helper.props.location.state && route_helper.props.location.state.house;
  }

  get view(){
    var route_helper = this;
    return route_helper.update.view || (route_helper.tableSelected() ? 'table' : 'graph');
  }

  get graph_attr(){
    var route_helper = this;
    return route_helper.update.graph_attr || route_helper.props.params.graph_attr || 'consumption';
  }

  get dataset(){
    var route_helper = this;
    return route_helper.update.dataset || (route_helper.energySelected() ? 'energy' : 'power');
  }

  get power_range(){
    var route_helper = this,
    range = route_helper.update.power_range || route_helper.props.location.query.dates;
    if (range) {
      range[0] = +range[0];
      range[1] = +range[1];
    }
    return range;
  }

  get date_params(){
    var route_helper = this;
    return {
      month: route_helper.update.month || route_helper.house.month,
      year: route_helper.update.year || route_helper.house.year };
  }

  get new_state(){
    var route_helper = this;
    return Object.keys(route_helper.update).reduce((state, key)=>{
      if (['house'].indexOf(key) >= 0) state[key] = route_helper.update[key];
      return state;
    }, {});
  }


  // compare house state to updates or params.
  routeUpdated(){
    var route_helper = this,
      house = route_helper.house;
    return (route_helper.energySelected() && !house.matchesYearState(route_helper.date_params)) ||
            (route_helper.powerSelected() && !house.matchesMonthState(route_helper.date_params) || !house.matchesPowerRange(route_helper.power_range)) &&
            (!route_helper.update.view || route_helper.update.view !== route_helper.view);
  }

  // This will update the house state acccording to passed update parameters.
  updateHouseState(){
    var route_helper = this,
      house = route_helper.house;
    house.setMonthState(route_helper.date_params, route_helper.update.power_range);
    if (route_helper.energySelected()){
      route_helper.router.push({state: {loading_energy_data: true}})
      return house.setEnergyData().then(()=>{ return {loading_energy_data: false} });
    } else if (route_helper.powerSelected()) {
      route_helper.router.push({state: {loading_power_data: true}})
      return house.setPowerData().then(()=>{ return {loading_power_data: false} });
    } else return Promise.resolve({});
  }

  updateRoute(){
    var route_helper = this;
    return route_helper.updateHouseState()
      .then((data_state)=>{
        route_helper.router.push({
          pathname: route_helper.newRoute(),
          query: route_helper.newQuery(),
          state: Object.assign(data_state, route_helper.new_state)
        });
      });
  }

  // should be run AFTER updateHouseState is called.
  newRoute(){
    var route_helper = this,
      house = route_helper.house;
    if (route_helper.dataset === 'energy'){
      return `/houses/${house.data.id}/energy/${house.state.year}/${route_helper.graph_attr}/${route_helper.view}`;
    } else {
      return `/houses/${house.data.id}/power/${house.state.month}/${house.state.year}/${route_helper.view}`;
    }
  }

  newQuery(){
    var route_helper = this;
    if (route_helper.dataset === 'power') return {dates: route_helper.house.state.power_range};
    else return {};
  }

  graphSelected(){
    return RouteHelper.graphSelected(this.props.routes);
  }

  static graphSelected(routes){
    if (RouteHelper.energySelected(routes)){
      return ArrayUtil.any(routes, (route)=>{ return route.component === EnergyGraph; });
    } else if (RouteHelper.powerSelected(routes)){
      return ArrayUtil.any(routes, (route)=>{ return route.component === PowerGraph; });
    }
    return false;
  }

  tableSelected(){
    return RouteHelper.tableSelected(this.props.routes);
  }

  static tableSelected(routes){
    if (RouteHelper.energySelected(routes)){
      return ArrayUtil.any(routes, (route)=>{ return route.component === EnergyTable; });
    } else if (RouteHelper.powerSelected(routes)){
      return ArrayUtil.any(routes, (route)=>{ return route.component === PowerTable; });
    }
    return false;
  }

  energySelected(){
    return RouteHelper.energySelected(this.props.routes);
  }

  static energySelected(routes){
    return ArrayUtil.any(routes, (route)=>{ return route.component === Energy; });
  }

  powerSelected(){
    return RouteHelper.powerSelected(this.props.routes);
  }

  static powerSelected(routes){
    return ArrayUtil.any(routes, (route)=>{ return route.component === Power; });
  }


}

