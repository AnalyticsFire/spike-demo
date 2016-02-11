import extend from 'extend';

import PowerDatum from './power_datum';
import EnergyDatum from './energy_datum';
import PowerDataApi from './../api/power_data';
import EnergyDataApi from './../api/energy_data';
import HousesApi from './../api/houses';
import ArrayUtil from './../../shared/utils/array'
import MathUtil from './../../shared/utils/math'

class House {

  constructor(data){
    var house = this;
    House.store.set(data.id, house);
    house.data = data;
    house.energy_data = [];
    house.power_data = [];
    house.energy_data_store = new Map();
    house.power_data_store = new Map();
  }

  get react_key(){
    return `house-${this.data.id}`;
  }

  ensurePowerData(opts){
    opts = extend({
      start_date: undefined,
      end_date: undefined
    }, opts || {});
    var house = this,
      date_range = Array.from(house.power_data_store.keys()),
      min_date = Math.min(date_range),
      max_date = Math.max(date_range),
      query_ranges, cache;

    if (date_range.length === 0){
      return house.getPowerData({dates: [[opts.start_date, opts.end_date]]});
    }

    query_ranges = MathUtil.minusRange([opts.start_date, opts.end_date], [min_date, max_date]);
    if (!query_ranges) return Promise.resolve(house.power_data);

    cache = ArrayUtil.selectMap(date_range, (datum_time)=>{
      return ArrayUtil.all(query_ranges, (query_range)=>{
        !MathUtil.inRange(datum_time, query_range);
      });
    }, (datum_time)=>{
      return house.power_data_store.get(datum_time);
    });

    if (query_ranges.length > 0){
      return house.getPowerData({dates: query_ranges}).then((new_power_data)=>{
        return new_power_data.concat(cache);
      });
    } else return Promise.resolve(cache);
  }

  getPowerData(params){
    var house = this;
    params.house_id = house.data.id;
    return PowerDataApi.index(params).then((power_data)=>{
      return power_data.map((power_datum_data)=>{
        var power_datum = PowerDatum.updateOrInitialize(power_datum_data, house);
        house.power_data_store.set(power_datum.data.time, power_datum);
        house.power_data.push(power_datum);
        return power_datum;
      });
    });
  }

  ensureEnergyData(opts){
    opts = extend({
      start_date: undefined,
      end_date: undefined
    }, opts || {});
    var house = this,
      date_range = Array.from(house.energy_data_store.keys()),
      min_date = Math.min(date_range),
      max_date = Math.max(date_range),
      query_ranges, cache;

    if (date_range.length === 0) return house.getEnergyData({dates: [[opts.start_date, opts.end_date]]})

    query_ranges = MathUtil.minusRange([opts.start_date, opts.end_date], [min_date, max_date]);
    if (!query_ranges) return Promise.resolve(house.power_data);

    cache = ArrayUtil.selectMap(date_range, (datum_day)=>{
      return ArrayUtil.all(query_ranges, (query_range)=>{
        return !MathUtil.inRange(datum_day, query_range);
      });
    }, (datum_day)=>{
      return house.energy_data_store.get(datum_day);
    });

    if (query_ranges.length > 0){
      return house.getEnergyData({dates: query_ranges}).then((new_energy_data)=>{
        return new_energy_data_store.concat(cache);
      });
    } else return Promise.resolve(cache);
  }

  getEnergyData(params){
    var house = this;
    params.house_id = house.data.id;
    return EnergyDataApi.index(params).then((energy_data)=>{
      return energy_data.map((energy_datum_data)=>{
        var energy_datum = EnergyDatum.updateOrInitialize(energy_datum_data, house);
        house.energy_data_store.set(energy_datum.day, energy_datum);
        house.energy_data.push(energy_datum);
        return energy_datum;
      });
    });
  }

  update(data){
    var house = this;
    extend(house.data, data);
  }

  static updateOrInitialize(id, data){
    var house = PowerDatum.store.get(id);
    if (house) house.update(data);
    return house || new House(data, data)
  }

  static ensureHouses(ids){
    var required_ids, cached_houses = [];
    if (ids){
      required_ids = ArrayUtil.diff(ids, House.store.keys());
      cached_houses = ArrayUtil.diff(ids, required_ids).map((id)=>{ return House.store.get(id); });
    }
    if (required_ids && required_ids.length == 0) return Promise.resolve([]);

    return House.getHouses(required_ids).then((new_houses)=>{
      // if these need to be ordered, then concatenation needs to be merged in order.
      return new_houses.concat(cached_houses);
    });
  }

  static getHouses(ids){
    return HousesApi.index({id: ids}).then((houses_data)=>{
      return houses_data.map((house_data)=>{
        return new House(house_data);
      });
    });
  }

}

House.store = new Map();

export default House;
