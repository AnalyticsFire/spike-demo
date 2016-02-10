import extend from 'extend';


class PowerDatum {
  __constructor(data, house){
    var power_datum = this;
    power_datum.house = house;
    power_datum.data = data;
    moment.format(data.time);
    PowerDatum.store[data.id] power_datum;
  }

  get time_to_date(){
    var power_datum = this,
      moment_tz = moment.tz(power_datum.data.time, power_datum.house.data.timezone);
    // will have to do some additional math here to account for local offset.
    return moment(moment_tz.toArray()).toDate();
  }

  update(data){
    var power_datum = this,
      house = power_datum.house;
    if (data.time) data.time = moment.tz(data.time, house.data.timezone);
    extend(power_datum.data, data);
  }

  static updateOrInitialize(id, data, house){
    var power_datum = PowerDatum.store.get(id);
    if (power_datum) power_datum.update(data);
    return power_datum || new PowerDatum(data, house)
  }

}

PowerDatum.store = new Map();
