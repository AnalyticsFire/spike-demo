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

  get scoped_id(){
    return `power-datum-${this.data.id}`;
  }

  get time_to_date(){
    var power_datum = this,
      house = power_datum.house;
    return house.toDate(power_datum.data.time);
  }

  get net_consumption(){
    return Math.max(0, Math.round(this.data.consumption - this.data.production));
  }

  get time_to_s(){
    var power_datum = this,
      moment_tz = moment.tz(power_datum.data.time * 1000, power_datum.house.data.timezone);
    return moment_tz.format('YYYY-MM-DD HH:mm');
  }
  get consumption(){
    var power_datum = this;
    return Math.round(power_datum.data.consumption);
  }
  get production(){
    var power_datum = this;
    return Math.round(power_datum.data.production);
  }

}

PowerDatum.NAME = NAME;
PowerDatum.COLLECTION_DEFAULTS = COLLECTION_DEFAULTS;

export default PowerDatum;
