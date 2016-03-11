import query_string from 'query-string';
import moment from 'moment-timezone';

import EnergyDatum from './../models/energy_datum';
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
  }, {
    path: /(irradiance)\/([^\/]+)\/(\d+)\/([^\/]+)\/?$/,
    parameters: { 1: 'dataset', 2: 'month', 3: 'year', 4: 'view' }
  }
];

class StateManager {

  constructor(createHistory, houses){
    var state_manager = this;

    state_manager.houses = houses;

    state_manager.state = {
      loading_data: false,
      graph_attr: 'consumption',
      view: 'graph',
      dataset: 'power',
      house_id: null,
      house: null,
      month: null,
      year: null,
      date_interval: null };

    state_manager.history = createHistory();
    state_manager.update_in_progress = false;
  }

  get month_i(){
    return moment.monthsShort().indexOf(this.state.month);
  }

  get date_params(){
    return ObjectUtil.filterKeys(this.state, ['year', 'month', 'date_interval']);
  }

  get month_range(){
    var state_manager = this,
      house = state_manager.state.house,
      start_time = house.parseMoment(`${state_manager.state.year}-${state_manager.month_i + 1}-01`, 'YYYY-M-DD'),
      end_time = start_time.clone().endOf('month').unix();

    start_time = start_time.unix();
    if (start_time < house.data.data_from) start_time = house.data.data_from;
    if (end_time > house.data.data_until) end_time = house.data.data_until;
    return [start_time, end_time];
  }

  get year_range(){
    var state_manager = this,
      house = state_manager.state.house,
      start_time = house.parseMoment(`${state_manager.state.year}-01-01`, 'YYYY-MM-DD'),
      end_time = start_time.clone().endOf('year').unix();

    start_time = start_time.unix();
    if (start_time < house.data.data_from) start_time = house.data.data_from;
    if (end_time > house.data.data_until) end_time = house.data.data_until;
    return [start_time, end_time];
  }

  matchesEnergyState(){
    var state_manager = this,
      house = state_manager.state.house,
      energy_range = state_manager.state.graph_attr === 'irradiance' ? state_manager.state.date_interval : state_manager.year_range;
    if (!house.state.energy_range) return false;
    return energy_range[0] === house.state.energy_range[0] && energy_range[1] === house.state.energy_range[1];
  }

  matchesPowerState(){
    var state_manager = this,
      house = state_manager.state.house,
      month_range = state_manager.month_range;
    if (!house.state.power_range) return false;
    return month_range[0] === house.state.power_range[0] && month_range[1] === house.state.power_range[1];
  }

  // This will update the house state acccording to passed update parameters.
  updateHouseFromState(component){
    var state_manager = this,
      house = state_manager.state.house,
      promise;
    if (!house) {
      promise = Promise.resolve();
    } else if (state_manager.state.dataset === 'energy' && !state_manager.matchesEnergyState()){
      promise = state_manager.setHouseEnergyFromState(component);
    } else if (state_manager.state.dataset === 'power' && !state_manager.matchesPowerState()){
      promise = state_manager.setHousePowerFromState(component);
    } else if (state_manager.state.dataset === 'irradiance'){
      promise = state_manager.setIrradianceData(component);
    } else {
      promise = Promise.resolve();
    }
    return promise.then(()=>{
      state_manager.update_in_progress = false;
      return new Promise((fnResolve, fnReject)=>{
        component.syncFromStateManager(fnResolve);
      });
    });
  }

  setHouseEnergyFromState(component){
    var state_manager = this;
    return new Promise((fnResolve, fnReject)=>{
      component.setState({
        loading_data: 'power'
      }, ()=>{
        state_manager.state.house.setEnergyData(state_manager.year_range)
          .then(fnResolve);
      });
    });
  }

  setHousePowerFromState(component){
    var state_manager = this,
      house = state_manager.state.house;
    return new Promise((fnResolve, fnReject)=>{
      component.setState({
        loading_data: 'energy'
      }, ()=>{
        house.setPowerData(state_manager.state.date_interval)
          .then(fnResolve);
      });
    });
  }

  setIrradianceData(component){
    var state_manager = this,
      houses = state_manager.houses,
      date_interval = state_manager.state.date_interval;
    return new Promise((fnResolve, fnReject)=>{
      component.setState({
        loading_data: 'irradiance'
      }, ()=>{
        EnergyDatum.ensureEnergyDataForHouses(houses, date_interval)
          .then((res)=>{
            if (res instanceof Promise){
              throw new Error('promise returned promise')
            }
            var promises = [],
              data = {};
            houses.forEach((house)=>{
              var promise = house.setEnergyData(date_interval)
                .then(()=>{
                  house.energy_data.forEach((energy_datum)=>{
                    var date_data = data[energy_datum.day_to_s];
                    if (!date_data){
                      date_data = [];
                      data[energy_datum.day_to_s] = date_data;
                    }
                    date_data.push(energy_datum);
                  });
                  house.closeDb();
                });
              promises.push(promise);
            });
            Promise.all(promises)
              .then(()=>{
                state_manager.irradiance_data = data;
                fnResolve();
              });
          });
      });
    });
  }

  /*
   * Change Params -> Change Url
   */

  setParams(params){
    var state_manager = this,
      url, house, params;
    if (state_manager.update_in_progress) return false;
    state_manager.update_in_progress = true;

    params = Object.assign({}, state_manager.state, params);
    if (params.house_id){
      house = state_manager.houses.find((h)=>{ return h.data.id == params.house_id; });
    } else {
      house = state_manager.state.house || state_manager.houses[0];
      params.house_id = house.data.id;
    }

    house.verifyMonthState(params);
    if (params.dataset === 'irradiance'){
      params.date_interval = house.verifyPowerRange(params.date_interval || [], params);
      url = `/irradiance/${params.month}/${params.year}/${params.view}?${query_string.stringify({dates: params.date_interval})}`;
    } else if (params.dataset === 'energy'){
      url = `/houses/${params.house_id}/energy/${params.year}/${params.graph_attr}/${params.view}`;
    } else {
      params.date_interval = house.verifyPowerRange(params.date_interval || [], params);
      url = `/houses/${params.house_id}/power/${params.month}/${params.year}/${params.view}?${query_string.stringify({dates: params.date_interval})}`;
    }

    state_manager.history.push(url);
  }

  /*
   * Url Changed -> Change State
   */

  updateStateFromUrl(location, component){
    var state_manager = this,
      params = state_manager.parseUrl(location.pathname),
      house = null;
    if (params.house_id){
      house = state_manager.houses.find((h)=>{ return h.data.id == params.house_id; });
    } else if (params.dataset === 'irradiance'){
      // Irradiance needs a house to verify params and
      house = state_manager.state.house || state_manager.houses[0];
    }

    if (house){
      // params should already be verified if set through StateManager#setParams, but
      // verify here again before setting state in case URL manually loaded.
      house.verifyMonthState(params);
      if (params.dataset === 'power' || params.dataset === 'irradiance') {
        var date_interval = location.query.dates || [];
        params.date_interval = house.verifyPowerRange([+date_interval[0], +date_interval[1]], params);
      }
      state_manager.state.house = house;
      state_manager.state.house_id = house.data.id;
    }

    Object.assign(state_manager.state, params);
    if (state_manager.state.house_id) {
      state_manager.updateHouseFromState(component);
    } else {
      component.syncFromStateManager(()=>{
        state_manager.update_in_progress = false;
      });
    }
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
