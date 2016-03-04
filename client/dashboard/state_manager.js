import query_string from 'query-string';

import ObjectUtil from './../../shared/utils/object';
import ArrayUtil from './../../shared/utils/array';

const ROUTES = [
  {
    path: /houses\/(\d+)\/?$/,
    parameters: {1: 'house_id'}
  }, {
    path: /houses\/(\d+)\/(energy)\/(\d+)\/([^\/]+)\/([^\/]+)\/?$/,
    parameters: { 1: 'house_id', 2: 'dataset', 3: 'year', 4: 'graph_attr', 5: 'view' }
  }, {
    path: /houses\/(\d+)\/(power)\/([^\/]+)\/(\d+)\/([^\/]+)\/?$/,
    parameters: { 1: 'house_id', 2: 'dataset', 3: 'month', 4: 'year', 5: 'view' }
  }
];

class StateManager {

  constructor(createHistory, houses){
    var state_manager = this;

    state_manager.houses = houses;

    state_manager.state = {
      loading_energy_data: false,
      loading_power_data: false,
      graph_attr: 'consumption',
      view: 'graph',
      dataset: 'power',
      house_id: null,
      house: null,
      month: null,
      year: null,
      power_range: null };

    state_manager.history = createHistory();
    state_manager.update_in_progress = false;
  }

  get date_params(){
    return ObjectUtil.filterKeys(this.state, ['year', 'month', 'power_range']);
  }

  // This will update the house state acccording to passed update parameters.
  updateHouseFromState(component){
    var state_manager = this,
      house = state_manager.state.house,
      promise;
    if (!house) {
      promise = Promise.resolve();
    } else if (state_manager.state.dataset === 'energy' && (!house.energy_data || !house.matchesEnergyState(state_manager.state))){
      house.setMonthState(state_manager.state);
      promise = state_manager.setHouseEnergyFromState(component);
    } else if (state_manager.state.dataset === 'power' && !house.power_data || !house.matchesPowerState(state_manager.state)){
      house.setMonthState(state_manager.state);
      promise = state_manager.setHousePowerFromState(component);
    } else {
      promise = new Promise((fnResolve, fnReject)=>{
        component.syncFromStateManager(fnResolve);
      });
    }
    return promise.then(()=>{ state_manager.update_in_progress = false; })
  }

  setHouseEnergyFromState(component){
    var state_manager = this;
    state_manager.power_data_updated = true;
    return new Promise((fnResolve, fnReject)=>{
      component.setState({
        loading_energy_data: true
      }, ()=>{
        state_manager.state.house.setEnergyData()
          .then(()=>{
            component.syncFromStateManager(fnResolve);
          });
      });
    });
  }

  powerDataRendered(){
    var state_manager = this;
    state_manager.power_data_updated = false;
  }

  setHousePowerFromState(component){
    var state_manager = this,
      house = state_manager.state.house;
    return new Promise((fnResolve, fnReject)=>{
      component.setState({
        loading_power_data: true
      }, ()=>{
        house.setPowerData()
          .then(()=>{
            component.syncFromStateManager(fnResolve);
          });
      });
    });
  }

  /*
   * Change Params -> Change Url
   */

  setParams(params){
    var state_manager = this,
      url;
    if (state_manager.update_in_progress) return false;
    state_manager.update_in_progress = true;
    params = Object.assign({}, state_manager.state, params);
    if (!params.house_id){
      url = '/';
    } else {
      var house = state_manager.houses.find((h)=>{ return h.data.id == params.house_id; })

      house.verifyMonthState(params);
      if (params.dataset === 'energy'){
        url = `/houses/${params.house_id}/energy/${params.year}/${params.graph_attr}/${params.view}`;
      } else if (params.dataset === 'power'){
        house.verifyPowerRange(params);
        url = `/houses/${params.house_id}/power/${params.month}/${params.year}/${params.view}?${query_string.stringify({dates: params.power_range})}`;
      } else {
        url = `/houses/${house.house_id}`;
      }
    }
    state_manager.history.push(url);
  }

  /*
   * Url Changed -> Change State
   */

  updateStateFromUrl(location, component){
    var state_manager = this;
    return new Promise((fnResolve, fnReject)=>{
      var params = state_manager.parseUrl(location.pathname),
        house = null;
      if (params.dataset === 'power' && location.query.dates) {
        params.power_range = [+location.query.dates[0], +location.query.dates[1]];
      }
      if (params.house_id || params.house_id != state_manager.state.house_id){
        house = state_manager.houses.find((h)=>{ return h.data.id == params.house_id; });
      }
      state_manager.state.house = house;
      Object.assign(state_manager.state, params);
      if (state_manager.state.house_id) {
        state_manager.updateHouseFromState(component);
      } else {
        component.syncFromStateManager(()=>{
          state_manager.update_in_progress = false;
          fnResolve();
        });
      }
    });
  }

  parseUrl(url, query){
    for (var route of ROUTES){
      var match = url.match(route.path);
      if (match){
        var parsed = {};
        for (var index in route.parameters){
          parsed[route.parameters[index]] = match[index];
        }
        return parsed;
      }
    }
    return {};
  }

}

export default StateManager;
