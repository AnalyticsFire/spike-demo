import extend from 'extend';


class EnergyDatum {
  __constructor(data, house){
    var energy_datum = this;
    energy_datum.house = house;
    energy_datum.data = data;
    moment.tz(data.day, house.data.timezone);
    EnergyDatum.store[data.id] energy_datum;
  }

  get day_to_date(){
    var energy_datum = this,
      moment_tz = moment.tz(energy_datum.data.day, energy_datum.house.data.timezone);
    // will have to do some additional math here to account for local offset.
    return moment(moment_tz.toArray()).toDate();
  }

  update(data){
    var energy_datum = this,
      house = power_datum.house;
    if (data.day) data.day = moment.tz(data.day, house.data.timezone);
    extend(energy_datum.data, data);
  }

  static updateOrInitialize(id, data, house){
    var energy_datum = EnergyDatum.store.get(id);
    if (energy_datum) energy_datum.update(data);
    return energy_datum || new EnergyDatum(data, house)
  }
}

EnergyDatum.store = new Map();
