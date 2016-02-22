import extend from 'extend';
import moment from 'moment-timezone';

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

  get react_key(){
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

  get consumption_to_s(){
    var energy_datum = this;
    return Math.round(energy_datum.data.consumption);
  }

  get production_to_s(){
    var energy_datum = this;
    return Math.round(energy_datum.data.production);
  }

}

EnergyDatum.NAME = NAME;
EnergyDatum.COLLECTION_DEFAULTS = COLLECTION_DEFAULTS;

export default EnergyDatum;
