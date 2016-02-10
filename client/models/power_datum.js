import extend from 'extend';
import moment from 'moment-timezone';

class PowerDatum {
  constructor(data, house){
    var power_datum = this;
    power_datum.house = house;
    data.time = moment.tz(data.time, house.data.timezone);
    power_datum.data = data;
    PowerDatum.store.set(data.id, power_datum);
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
    return power_datum.data.time.format('YYYY-MM-DD HH:MM');
  }
  get consumption_to_s(){
    var power_datum = this;
    return Math.round(power_datum.data.consumption);
  }
  get production_to_s(){
    var power_datum = this;
    return Math.round(power_datum.data.production);
  }

  update(data){
    var power_datum = this,
      house = power_datum.house;
    if (data.time) data.time = moment.tz(data.time, house.data.timezone);
    extend(power_datum.data, data);
  }

  static updateOrInitialize(data, house){
    var power_datum = PowerDatum.store.get(data.id);
    if (power_datum) power_datum.update(data);
    return power_datum || new PowerDatum(data, house)
  }

}

PowerDatum.store = new Map();

export default PowerDatum;
