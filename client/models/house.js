import extend from 'extend';
import Loki from 'lokijs/src/lokijs';
import moment from 'moment-timezone';

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
    house.power_date_range = [house.default_power_start, house.default_power_end];
  }

  get scoped_id(){
    return `house-${this.data.id}`;
  }

  get default_power_start(){
    var house = this;
    // 3600 * 24 seconds * 4 = 4 days.
    return house.data.data_until - 3600 * 24 * 4;
  }

  get default_power_end(){
    var house = this;
    return house.data.data_until;
  }

  toDate(unix){
    var house = this;
    return moment.tz(unix * 1000, house.data.timezone).toDate();
  }

  save(){
    var house = this;
    return House.collection(House.NAME)
      .then((house_collection)=>{
        house_collection.update(house.data);
        return House.db.save();
      });
  }

  setPowerData(opts){
    var house = this;
    opts = Object.assign({
      dates: house.power_date_range
    }, opts || {});
    return house.collection(PowerDatum.NAME, PowerDatum.COLLECTION_OPTIONS)
      .then((power_collection)=>{
        return house.ensurePowerData(opts)
          .then(()=>{
            var params = house.rangeToLokiParams('time', opts.dates);
            house.power_data = power_collection.find(params)
                  .sort((pd1, pd2)=>{
                    if (pd1.time === pd2.time) return 0;
                    if (pd1.time > pd2.time) return 1;
                    if (pd1.time < pd2.time) return -1;
                  })
                  .map((data)=>{ return new PowerDatum(data, house); })
          });
      });
  }

  ensurePowerData(opts){
    opts = extend({
      start_date: undefined,
      end_date: undefined
    }, opts || {});
    var house = this,
      existing_ranges = house.data.power_datum_ranges || [],
      query_ranges;

    query_ranges = DateRange.addRange(opts.dates, existing_ranges);
    if (query_ranges.gaps_filled.length > 0){
      var params = {dates: query_ranges.gaps_filled};
      return house.getPowerData(params)
        .then(()=>{
          house.data.power_datum_ranges = query_ranges.new_ranges;
          house.save();
        });
    } else { return Promise.resolve(); }
  }

  getPowerData(params){
    var house = this;
    params.house_id = house.data.id;
    return PowerDataApi.index(params)
      .then((power_data)=>{
        return house.collection(PowerDatum.NAME, PowerDatum.COLLECTION_OPTIONS)
                .then((power_collection)=>{
                  power_collection.insert(power_data);
                  house.db.save();
                });
      })
  }

  clearData(){
    var house = this;
    return new Promise((fnResolve, fnReject)=>{
      house.collection(PowerDatum.NAME)
        .then((power_collection)=>{
          power_collection.removeWhere({});
          house.db.save(()=>{
            House.collection(House.NAME)
              .then((house_collection)=>{
                house_collection.remove(house.data);
                House.db.save(()=>{
                  fnResolve();
                })
              });
          });
        });
    });
  }

  setEnergyData(opts){
    var house = this;
    return house.ensureEnergyData(opts)
      .then(()=>{
        return house.collection(EnergyDatum.NAME, EnergyDatum.COLLECTION_OPTIONS)
          .then((energy_collection)=>{
            var params = house.rangeToLokiParams('day', [opts.start_date, opts.end_date]);
            house.energy_data = energy_collection.find(params).map((data)=>{ return new EnergyDatum(data, house); })
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
        return house.collection(EnergyDatum.NAME, EnergyDatum.COLLECTION_OPTIONS)
                .then((energy_collection)=>{
                  energy_collection.insert(energy_data);
                  return house.db.save();
                });
      })
  }

  static ensureHouses(ids){
    return House.collection(House.NAME)
      .then((house_collection)=>{
        var houses_data = ids ? house_collection.find({id: {$in: ids}}) : house_collection.find();
        if (!ids && houses_data.length === 0 || ids && houses_data.length !== ids.length){
          var required_ids = ids ? ArrayUtil.diff(ids, houses_data.map((data)=>{ return data.id; })) : undefined;
          return HousesApi.index({id: ids})
            .then((required_houses)=>{
              required_houses.forEach((house_data)=>{
                house_collection.insert(house_data);
              });
              House.db.save();
              return houses_data.concat(required_houses);
            });
        } else { return Promise.resolve(houses_data); }
      }).then((houses_data)=>{
        return houses_data.map((house_data)=>{ return new House(house_data); })
      });
  }

}

Object.assign(House, Databasable);
export default House;
