import extend from 'extend';
import moment from 'moment-timezone';

const NAME = 'PowerDatum';
const COLLECTION_DEFAULTS = {
  indices: ['time'],
  unique_indices: ['time']
};

class PowerDatum {
  constructor(data, house){
    var power_datum = this;
    power_datum.house = house;
    power_datum.data = data;
  }

  get react_key(){
    return `power-datum-${this.data.id}`;
  }

  get time_to_date(){
    var power_datum = this,
      moment_tz = moment.tz(power_datum.data.time, power_datum.house.data.timezone);
    // will have to do some additional math here to account for local offset.
    return moment(moment_tz.toArray()).toDate();
  }

  get time_to_s(){
    var power_datum = this;
    return power_datum.data.time.format('YYYY-MM-DD HH:mm');
  }
  get consumption_to_s(){
    var power_datum = this;
    return Math.round(power_datum.data.consumption);
  }
  get production_to_s(){
    var power_datum = this;
    return Math.round(power_datum.data.production);
  }

}

PowerDatum.NAME = NAME;
PowerDatum.COLLECTION_DEFAULTS = COLLECTION_DEFAULTS;

export default PowerDatum;
