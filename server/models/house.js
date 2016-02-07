import moment from 'moment-timezone';
import DB from "./../config/database";
import {nodeInterface} from './../config/graphql/node';

const NAME = 'House';

/**
 * Sequelize Definition
 */

var House = DB.sequelize.define(NAME, {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  timezone: DB.Sequelize.STRING,
  name: DB.Sequelize.STRING
}, {
  paranoid: true,
  underscored: true,
  tableName: "houses",
  instanceMethods: {
    productionMultiplier: function(timestamp){
      var house = this,
        minute = moment.tz(timestamp, house.timezone).hour() * 60 + moment.tz(timestamp, house.timezone).minute(),
        multiplier = 0;
      if (minute > 420 && minute < 1140){
        multiplier = 1 - Math.abs(780 - minute) / 360;
      }
      return multiplier;
    },
    timeToDateString: function(timestamp){
      var house = this;
      return moment.tz(timestamp, house.timezone).format("YYYY-MM-DD");
    },
    aggregatePowerToEnergyData: function(){
      var house = this;
      return DB.EnergyDatum.destroy({where: {house_id: house.id}})
        .then(()=>{
          return house.getPowerData();
        })
        .then((power_data)=>{
          var energy_data = new Map();
          power_data.forEach((power_datum)=>{
            var day = house.timeToDateString(power_datum.time),
              energy_datum = energy_data.get(day) || {production: 0, consumption: 0, day: day, house_id: house.id};
            console.log(power_datum.time)
            console.log(day)
            energy_datum.production += power_datum.production;
            energy_datum.consumption += power_datum.consumption;
            energy_data.set(day, energy_datum);
          });
          console.log(Array.from(energy_data.values()))
          return DB.EnergyDatum.bulkCreate(Array.from(energy_data.values()), {validate: true});
        });
    }
  },
  classMethods: {
    set: ()=>{
      House.associate();
    },
    associate: ()=>{
      House.hasMany(DB.PowerDatum, {as: 'PowerData'});
    },
    getPowerDataByTime: (start_date, end_date)=>{
      var params = {
        where: {time: {}},
        attributes: ['time', 'consumption', 'production']
      };
      if (start_date) params.where.time.$gt = moment.utc(start_date).toDate();
      if (end_date) params.where.time.$lt = moment.utc(end_date).toDate();

      return House.getPowerData(params);
    }
  }
});

House.name = NAME;
module.exports = House;
