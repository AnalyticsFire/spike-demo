import extend from 'extend';
import Loki from 'lokijs/src/lokijs';
import moment from 'moment-timezone';

import HousesApi from 'api/houses';
import PowerDataApi from 'api/power_data';
import EnergyDataApi from 'api/energy_data';
import PowerDatum from './power_datum';
import EnergyDatum from './energy_datum';
import ArrayUtil from './../../shared/utils/array';
import MathUtil from './../../shared/utils/math';
import DateRange from './../../shared/utils/date_range';
import Databasable from './../lib/databasable';

const NAME = 'House';

class House {

  // must be initiated with a dataset already in Loki database (not directly JSON).
  constructor(data){
    var house = this;
    house.data = data;
    house.state = {};
    Object.assign(house, Databasable);

    var n_years = house.data_until_moment.year() - house.data_from_moment.year() + 1;
    house.years = [];
    for (var year=house.data_from_moment.year(); year<=house.data_until_moment.year(); year+=1){
      house.years.push(year);
    }
    house.setMonthState({
      month: house.data_until_moment.format('MMM'),
      year: house.data_until_moment.year()
    });
  }

  get data_from_moment(){
    var house = this;
    return moment.tz(house.data.data_from * 1000, house.data.timezone);
  }

  get data_until_moment(){
    var house = this;
    return moment.tz(house.data.data_until * 1000, house.data.timezone);
  }

  get scoped_id(){
    return `house-${this.data.id}`;
  }

  get select_props(){
    if (this.selected) return {selected: true};
    else return {};
  }

  availableMonths(){
    var  house = this,
      all_months = moment.monthsShort(),
      year = house.state.year.toString();
    if ((year) === house.data_from_moment.format('YYYY')){
      return all_months.slice(house.data_from_moment.month(), 12);
    } else if (year === house.data_until_moment.format('YYYY')){
      return all_months.slice(0, house.data_until_moment.month() + 1);
    } else {
      return all_months;
    }
  }

  setMonthState(params, power_ranges){
    var house = this,
      all_months = moment.monthsShort();

    if (house.state.month !== params.month || house.state.year != params.year){
      var new_year = +params.year;
      if (new_year >= house.data_from_moment.year() && new_year <= house.data_until_moment.year()){
        house.state.year = params.year;
      } else if (!house.state.year){
        house.state.year = house.years[house.years.length - 1];
      }
      var available_months = house.availableMonths();
      if (available_months.indexOf(params.month) >= 0){
        house.state.month = params.month;
      } else if (!house.state.month || available_months.indexOf(house.state.month) < 0){
        house.state.month = available_months[available_months.length - 1];
      }
    }

    var month_i = all_months.indexOf(house.state.month),
      new_month_moment = moment.tz({year: house.state.year, month: month_i, day: 1}, house.data.timezone).startOf('month');
    if (!house.state.current_month_moment || new_month_moment.unix() !== house.state.current_month_moment.unix()){
      house.state.current_month_moment = new_month_moment;
    }
    house.setDataRanges(power_ranges);
  }

  setDataRanges(power_ranges){
    var house = this,
        end_of_month = house.state.current_month_moment.clone().endOf('month'),
        end_of_current_data_moment = end_of_month > house.data_until_moment ? house.data_until_moment : end_of_month,
        energy_max = Math.min(end_of_current_data_moment.clone().endOf('year').unix(), house.data.data_until);
    house.state.energy_range = [end_of_current_data_moment.clone().startOf('year').unix(), energy_max];
    house.state.power_range = house.state.power_range || [];
    house.state.end_of_current_data_moment = end_of_current_data_moment;

    var current_data_range = [house.state.current_month_moment.unix(), end_of_current_data_moment.unix()],
      power_min = house.state.power_range[0],
      power_max = house.state.power_range[1];
    if (power_ranges){
      if (DateRange.inRange(power_ranges[1], current_data_range)){
        power_max = power_ranges[1];
      }
      if (DateRange.inRange(power_ranges[0], current_data_range) && power_ranges[0] < power_max){
        power_min = power_ranges[0];
      }
    }
    if (!power_max || !DateRange.inRange(power_max, current_data_range)){
      power_max = end_of_current_data_moment.unix();
    }
    if (!power_min || !DateRange.inRange(power_min, current_data_range) ||
      power_max - power_min > 3600 * 24 * 4){
      power_min = power_max - 3600 * 24 * 4;
    }
    house.state.power_range = [power_min, power_max];
  }

  matchesYearState(params){
    var house = this;
    return params.year == house.state.year;
  }

  matchesMonthState(params){
    var house = this;
    return params.month == house.state.month && params.year == house.state.year;
  }

  matchesPowerRange(params, dates){
    var house = this;
    return house.matchesMonthState(params) && house.state.power_range[0] == dates[0] && house.state.power_range[1] == dates[1];
  }

  offset_diff(unix){
    var house = this,
      tz = moment.tz.zone(house.data.timezone);
    return (new Date().getTimezoneOffset() - tz.offset(unix * 1000)) * 60;
  }

  toDate(unix){
    var house = this;
    return new Date((unix + house.offset_diff(unix)) * 1000);
  }

  formatDate(unix, format){
    var house = this;
    return moment.tz(unix * 1000, house.data.timezone).format(format)
  }

  save(){
    var house = this;
    return House.collection(House.NAME, House.NAME)
      .then((house_collection)=>{
        house_collection.update(house.data);
        return House.db.save();
      });
  }

  setPowerData(){
    var house = this;
    return house.collection(house.scoped_id, PowerDatum.NAME, PowerDatum.COLLECTION_OPTIONS)
      .then((power_collection)=>{
        return house.ensurePowerData()
          .then(()=>{
            var params = house.rangeToLokiParams('time', house.state.power_range);
            house.power_data = power_collection.find(params)
                  .sort((pd1, pd2)=>{
                    if (pd1.time === pd2.time) return 0;
                    if (pd1.time > pd2.time) return 1;
                    if (pd1.time < pd2.time) return -1;
                  })
                  .map((data)=>{ return new PowerDatum(data, house); });
          });
      });
  }

  ensurePowerData(){
    var house = this,
      query_ranges;

    query_ranges = DateRange.addRange(house.state.power_range, house.data.power_datum_ranges || []);
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
    return house.collection(house.scoped_id, PowerDatum.NAME, PowerDatum.COLLECTION_OPTIONS)
      .then((power_collection)=>{
        return PowerDataApi.index(params)
          .then((power_data)=>{
            power_collection.insert(power_data);
            house.db.save();
          });
      })
  }

  setEnergyData(){
    var house = this;
    return house.collection(house.scoped_id, EnergyDatum.NAME, EnergyDatum.COLLECTION_OPTIONS)
      .then((energy_collection)=>{
        return house.ensureEnergyData()
          .then(()=>{
            var params = house.rangeToLokiParams('day', house.state.energy_range);
            house.energy_data = energy_collection.find(params)
                  .sort((pd1, pd2)=>{
                    if (pd1.day === pd2.day) return 0;
                    if (pd1.day > pd2.day) return 1;
                    if (pd1.day < pd2.day) return -1;
                  })
                  .map((data)=>{ return new EnergyDatum(data, house); });
          });
      });
  }

  ensureEnergyData(){
    var house = this,
      query_ranges = DateRange.addRange(house.state.energy_range, house.data.energy_datum_ranges || []);
    if (query_ranges.gaps_filled.length > 0){
      return house.getEnergyData({dates: query_ranges.gaps_filled})
        .then(()=>{
          house.data.energy_datum_ranges = query_ranges.new_ranges;
          house.save();
        });
    } else { return Promise.resolve(); }
  }

  getEnergyData(params){
    var house = this;
    params.house_id = house.data.id;
    return house.collection(house.scoped_id, EnergyDatum.NAME, EnergyDatum.COLLECTION_OPTIONS)
            .then((energy_collection)=>{
              return EnergyDataApi.index(params)
                .then((energy_data)=>{
                  energy_collection.insert(energy_data);
                  house.db.save();
                });
      })
  }

  // removes all energy and power data from LokiJs (memory and persisted) database.
  clearData(){
    var house = this,
      all = [
        new Promise((fnResolve, fnReject)=>{
          house.collection(house.scoped_id, PowerDatum.NAME)
            .then((power_collection)=>{
              power_collection.removeWhere({});
              house.db.save(fnResolve);
            });
        }),
        new Promise((fnResolve, fnReject)=>{
          house.collection(house.scoped_id, EnergyDatum.NAME)
            .then((energy_collection)=>{
              energy_collection.removeWhere({});
              house.db.save(fnResolve);
            });
        }),
        new Promise((fnResolve, fnReject)=>{
          House.collection(House.NAME, House.NAME)
            .then((house_collection)=>{
              house_collection.remove(house.data);
              House.db.save(fnResolve);
            });
        })
      ]
    return Promise.all(all)
  }

  static ensureHouses(ids){
    return House.collection(House.NAME, House.NAME)
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

House.NAME = NAME;

Object.assign(House, Databasable);
export default House;
