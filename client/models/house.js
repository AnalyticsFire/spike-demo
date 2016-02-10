import Api from './../api';
import Store from './../store';
import ArrayUtil from './../../shared/util/array'

class House extends Base {

  __constructor(data, house){
    var energy_datum = this;
    House.store.set(data.id, house);
    house.data = data;
    house.energy_data = new Map();
    house.power_data = new Map();
  }

  ensurePowerData(start_date, end_date){
    var house = this,
      date_range = Array.from(house.power_data.keys()),
      min_date = Math.min(date_range),
      max_date = Math.max(date_range),
      query_ranges, cache;

    if (date_range.length === 0) return house.getPowerData({dates: [[start_date, end_date]]})

    query_ranges = MathUtil.minusRange([start_date, end_date], [min_date, max_date]);

    cache = ArrayUtil.selectMap(date_range, (datum_time)=>{
      return ArrayUtil.all(query_ranges, (query_range)=>{
        !MathUtil.inRange(datum_time, query_range);
      }));
    }, (datum_time)=>{
      return house.power_data.get(datum_time);
    });

    if (query_ranges.length > 0){
      return house.getPowerData({dates: dates}).then((new_power_data)=>{
        return new_power_data.concat(cache);
      });
    } else return Promise.resolve(cache);
  }

  getPowerData(params){
    var house = this;
    params.house_id = house.data.id;
    return Api.PowerData.index(params).then((power_data)=>{
      return power_data.map((power_datum_data)=>{
        var power_datum = Store.PowerDatum.updateOrInitialize(power_datum_data, house);
        house.power_data.set(power_datum.data.time, power_datum);
        return power_datum;
      });
    });
  }

  ensureEnergyData(start_date, end_date){
    var house = this,
      date_range = Array.from(house.energy_data.keys()),
      min_date = Math.min(date_range),
      max_date = Math.max(date_range),
      query_ranges, cache;

    if (date_range.length === 0) return house.getEnergyData({dates: [[start_date, end_date]]})

    query_ranges = MathUtil.minusRange([start_date, end_date], [min_date, max_date]);

    cache = ArrayUtil.selectMap(date_range, (datum_day)=>{
      return ArrayUtil.all(query_ranges, (query_range)=>{
        !MathUtil.inRange(datum_day, query_range);
      }));
    }, (datum_day)=>{
      return house.energy_data.get(datum_day);
    });

    if (query_ranges.length > 0){
      return house.getEnergyData({dates: dates}).then((new_energy_data)=>{
        return new_energy_data.concat(cache);
      });
    } else return Promise.resolve(cache);
  }

  getEnergyData(params){
    var house = this;
    params.house_id = house.data.id;
    return Api.PowerData.index(params).then((energy_data)=>{
      return power_data.map((energy_datum_data)=>{
        var energy_datum = Store.EnergyDatum.updateOrInitialize(energy_datum_data, house);
        house.energy_data.set(power_datum.time, energy_datum);
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
    var required_ids = ArrayUtil.diff(ids, House.store.keys()),
      cached_houses = ArrayUtil.diff(ids, required_ids).map((id)=>{ return House.store.get(id); });
    if (required_ids.length == 0) return Promise.resolve([]);

    return House.getHouses(required_ids).then((new_houses){
      // if these need to be ordered, then concatenation needs to be merged in order.
      return new_houses.concat(cached_houses);
    });
  }

  static getHouses(ids){
    return Api.HousesApi.index({id: ids}).then((houses_data)=>{
      return houses_data.map((house_data)=>{
        return new House(house_data);
      });
    });
  }

}

House.store = new Map();

export default House;
