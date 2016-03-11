import extend from 'extend';
import moment from 'moment-timezone';

import DateRange from './../../shared/utils/date_range';
import EnergyDataApi from 'api/energy_data';

const NAME = 'EnergyDatum';
const COLLECTION_DEFAULTS = {
  indices: ['day']
};

class EnergyDatum {
  constructor(data, house){
    var energy_datum = this;
    energy_datum.house = house;
    energy_datum.data = data;
  }

  get scoped_id(){
    return `energy-datum-${this.data.id}`;
  }

  // returns a datestamp that has the client timezone, but actually is house local time.
  get day_to_date(){
    var energy_datum = this,
      house = energy_datum.house;
    return house.toDate(energy_datum.data.day);
  }

  get day_to_s(){
    var energy_datum = this;
    return moment.tz(energy_datum.data.day * 1000, energy_datum.house.data.timezone).format('YYYY-MM-DD');
  }

  get irradiance(){
    var energy_datum = this;
    return Math.round(energy_datum.data.irradiance);
  }

  get consumption(){
    var energy_datum = this;
    return Math.round(energy_datum.data.consumption);
  }

  get production(){
    var energy_datum = this;
    return Math.round(energy_datum.data.production);
  }

  // This method will ensure the energy data for the passed houses while:
  // 1. Making only 1 API.
  // 2. Only opening 1 house LokiJs DB at a time.
  static ensureEnergyDataForHouses(houses, date_range){
    var new_ranges = {}, params = [];
    houses.forEach((house)=>{
      var query_ranges = DateRange.addRange(date_range, house.data.energy_datum_ranges || []);
      if (query_ranges.gaps_filled.length > 0) {
        params.push({dates: query_ranges.gaps_filled, house_id: house.data.id});
        new_ranges[house.data.id] = query_ranges.new_ranges;
      }
    });

    // already have all the data we need.
    if (params.length === 0) return Promise.resolve();

    // get all data needed for all houses in one call.
    return new Promise((fnResolve, fnReject)=>{
      EnergyDataApi.index({houses: params})
        .then((energy_data)=>{
          energy_data = energy_data.reduce((grouped, energy_datum)=>{
            grouped[energy_datum.house_id] = grouped[energy_datum.house_id] || [];
            grouped[energy_datum.house_id].push(energy_datum);
            return grouped;
          }, {});
          houses.reduce((promise, house)=>{
            return promise.then(()=>{
              if (!energy_data[house.data.id]) return Promise.resolve();
              return house.saveEnergyData(energy_data[house.data.id], new_ranges[house.data.id])
            }).then(()=>{
              house.closeDb();
            });
          }, Promise.resolve()).then(fnResolve);
        });
    })
  }

}

EnergyDatum.NAME = NAME;
EnergyDatum.COLLECTION_DEFAULTS = COLLECTION_DEFAULTS;

export default EnergyDatum;
