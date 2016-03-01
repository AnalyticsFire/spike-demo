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

  constructor(house, props, update){
    var route_helper = this;
    route_helper.house = house;
    route_helper.props = props;
    route_helper.update = update || {};
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
    var route_helper = this;
    return route_helper.update.power_range || route_helper.props.location.query['dates[]'];
  }

  get date_params(){
    var route_helper = this;
    return {
      month: route_helper.update.month || route_helper.house.month,
      year: route_helper.update.year || route_helper.house.year };
  }

  routeUpdated(){
    var route_helper = this,
      house = route_helper.house;
    return (route_helper.energySelected() && !house.matchesYearState(route_helper.date_params)) ||
            (route_helper.powerSelected() && !house.matchesMonthState(route_helper.date_params) || !house.matchesPowerRange(route_helper.power_range));
  }

  // This will update the house state acccording to passed update parameters.
  updateHouseState(){
    var route_helper = this,
      house = route_helper.house;
    house.setMonthState(route_helper.date_params, route_helper.update.power_range);
  }

  paramsHaveDateState(){
    var route_helper = this;
    return !!route_helper.props.params.year;
  }

  // This will update the house according to URL parameters.
  updateHouseToParams(){
    var route_helper = this,
      house = route_helper.house,
      power_range;
    if (route_helper.props.location.query['dates[]']){
      power_range = [];
      power_range[0] = +route_helper.props.location.query['dates[]'][0];
      power_range[1] = +route_helper.props.location.query['dates[]'][1];
    }
    house.setMonthState(route_helper.props.params, power_range);
  }

  // should be run AFTER updateHouseState is called.
  newRoute(){
    var route_helper = this,
      house = route_helper.house;
    if (route_helper.dataset === 'energy'){
      return `/houses/${house.data.id}/energy/${house.state.year}/${route_helper.graph_attr}/${route_helper.view}`;
    } else {
      return `/houses/${house.data.id}/power/${house.state.month}/${house.state.year}/${route_helper.view}?${jQuery.param({dates: house.state.power_range})}`;
    }
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

