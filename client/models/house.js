import extend from 'extend';
import Loki from 'loki';

import PowerDatum from './power_datum';
import EnergyDatum from './energy_datum';
import PowerDataApi from './../api/power_data';
import EnergyDataApi from './../api/energy_data';
import HousesApi from './../api/houses';
import ArrayUtil from './../../shared/utils/array';
import MathUtil from './../../shared/utils/math';
import DateRange from './../../shared/utils/date_range';
import Databasable from './../lib/databasable';

class House {

  // must be initiated with a dataset already in Loki database (not directly JSON).
  constructor(data){
    var house = this;
    house.data = data;
    Object.assign(house, Databasable);
  }

  get scoped_id(){
    return `house-${this.data.id}`;
  }

  save(){
    var house = this;
    return House.collection()
      .then((house_collection)=>{
        return house_collection.update(house.data);
      });
  }

  setPowerData(opts){
    var house = this;
    return house.ensurePowerData(opts)
      .then(()=>{
        return house.collection(PowerDatum.NAME, PowerDatum.COLLECTION_OPTIONS)
          .then((power_collection)=>{
            var params = house.rangeToLokiParams('time', [opts.start_date, opts.end_date]);
            house.power_data = power_collection.find(params).map((data)=>{ return new PowerDatum(data); })
          });
      })
  }

  ensurePowerData(opts){
    opts = extend({
      start_date: undefined,
      end_date: undefined
    }, opts || {});
    var house = this,
      query_ranges = DateRange.addRange([opts.start_date, opts.end_date], house.data.power_datum_ranges);

    if (query_ranges.gaps_filled.length > 0){
      house.getPowerData({dates: query_ranges.gaps_filled})
        .then(()=>{
          house.data.power_datum_ranges = query_ranges.new_ranges;
          return house.save();
        });
    } else { return Promise.resolve(); }
  }

  getPowerData(params){
    var house = this;
    params.house_id = house.data.id;
    return PowerDataApi.index(params)
      .then((power_data)=>{
        return house.collection(PowerDatum.NAME, PowerDatum.COLLECTION_OPTIONS);
                .then((power_collection)=>{
                  power_collection.insert(power_data);
                  return house.db.save();
                });
      })
  }

  setEnergyData(opts){
    var house = this;
    return house.ensureEnergyData(opts)
      .then(()=>{
        return house.collection(EnergyDatum.NAME, EnergyDatum.COLLECTION_OPTIONS)
          .then((energy_collection)=>{
            var params = house.rangeToLokiParams('day', [opts.start_date, opts.end_date]);
            house.energy_data = energy_collection.find(params).map((data)=>{ return new EnergyDatum(data); })
          });
      })
  }

  ensureEnergyData(opts){
    opts = extend({
      start_date: undefined,
      end_date: undefined
    }, opts || {});
    var house = this,
      query_ranges = DateRange.addRange([opts.start_date, opts.end_date], house.data.energy_datum_ranges);

    if (query_ranges.gaps_filled.length > 0){
      house.getEnergyData({dates: query_ranges.gaps_filled})
        .then(()=>{
          house.data.energy_datum_ranges = query_ranges.new_ranges;
          return house.save();
        });
    } else { return Promise.resolve(); }
  }

  getEnergyData(params){
    var house = this;
    params.house_id = house.data.id;
    return EnergyDataApi.index(params)
      .then((energy_data)=>{
        return house.collection(EnergyDatum.NAME, EnergyDatum.COLLECTION_OPTIONS);
                .then((energy_collection)=>{
                  energy_collection.insert(energy_data);
                  return house.db.save();
                });
      })
  }

  static ensureHouses(ids){
    House.collection()
      .then((house_collection)=>{
        houses = house_collection.find({id: {$in: ids}});
        if (houses.length !== ids.length){
          required_ids = ArrayUtil.diff(ids, houses.map((house)=>{ return house.id; }));
          return House.getHouses(required_ids)
            .then((required_houses){
              return houses.concat(required_houses);
            });
        } else { return houses; }
      }).then((house_data)=>{
        return houses_data.map((house_data)=>{ return new House(house_data); })
      });
  }

  static getHouses(ids){
    return HousesApi.index({id: ids})
      .then((houses_data)=>{
        return House.collection()
          .then((house_collection)=>{
            houses_data.forEach((house_data)=>{
              house_collection.insert(house_data);
            });
            return houses_data;
          });
      });
  }

}

Object.assign(House, Databasable);
export default House;
