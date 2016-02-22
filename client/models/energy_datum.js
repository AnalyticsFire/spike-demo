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
    data.day = moment.tz(data.day, house.data.timezone);
    energy_datum.data = data;
  }

  get react_key(){
    return `energy-datum-${this.data.id}`;
  }

  get day_to_date(){
    var energy_datum = this,
      moment_tz = moment.tz(energy_datum.data.day, energy_datum.house.data.timezone);
    // will have to do some additional math here to account for local offset.
    return moment(moment_tz.toArray()).toDate();
  }

  get day_to_s(){
    var energy_datum = this;
    return energy_datum.data.day.format('YYYY-MM-DD');
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
