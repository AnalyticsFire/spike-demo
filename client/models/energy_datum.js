import extend from 'extend';
import moment from 'moment-timezone';

class EnergyDatum {
  constructor(data, house){
    var energy_datum = this;
    energy_datum.house = house;
    data.day = moment.tz(data.day, house.data.timezone);
    energy_datum.data = data;
    EnergyDatum.store.set(data.id, energy_datum);
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

  update(data){
    var energy_datum = this,
      house = energy_datum.house;
    if (data.day) data.day = moment.tz(data.day, house.data.timezone);
    extend(energy_datum.data, data);
  }

  static updateOrInitialize(data, house){
    var energy_datum = EnergyDatum.store.get(data.id);
    if (energy_datum) energy_datum.update(data);
    return energy_datum || new EnergyDatum(data, house)
  }
}

EnergyDatum.store = new Map();

export default EnergyDatum;
