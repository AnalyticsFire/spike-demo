import moment from 'moment-timezone';
import DB from "./../config/database";
import DataHelper from './../lib/data_helper';

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
  name: DB.Sequelize.STRING,
  production_multiplier: DB.Sequelize.FLOAT,
  data_until: {
    type: DB.Sequelize.INTEGER,
  },
  data_from: {
    type: DB.Sequelize.INTEGER,
  }
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
      return multiplier * house.production_multiplier;
    },
    unixToLocalDay: function(unix){
      var house = this;
      return moment.tz(unix * 1000, house.timezone).startOf('day').unix();
    },
    dayToMonthDayString: function(unix){
      var house = this;
      return moment.tz(unix * 1000, house.timezone).format('MM-DD');
    },
    aggregatePowerToEnergyData: function(){
      var house = this,
        base_irradiance;
      return DB.EnergyDatum.destroy({where: {house_id: house.id}})
        .then(()=>{
          return DataHelper.baseIrradiance();
        })
        .then((data)=>{
          base_irradiance = data;
          return DB.PowerDatum.count({where: {house_id: house.id}})
        })
        .then((count)=>{
          var limit = 0,
            energy_data = new Map(),
            promises = [];
          console.log('House#aggregatePowerToEnergyData')
          while (limit < count){
            let complete = DB.PowerDatum.findAll({where: {house_id: house.id}, limit: 1000, offset: limit, order: 'id ASC'})
              .then((power_data)=>{
                power_data.forEach((power_datum)=>{
                  var day = house.unixToLocalDay(power_datum.time),
                    energy_datum = energy_data.get(day) || {production: 0, consumption: 0, day: day, house_id: house.id};
                  energy_datum.production += power_datum.production / 1000; // convert Wh to kWh
                  energy_datum.consumption += power_datum.consumption / 1000; // convert Wh to kWh
                  energy_data.set(day, energy_datum);
                });
              });
            promises.push(complete);
            limit += 1000;
          }
          return Promise.all(promises).then(()=>{
            Array.from(energy_data.values()).forEach((energy_datum)=>{
              let day_multiplier = 1 + Math.random() * 0.10 - 0.05,
                base_day_irradiance = base_irradiance[house.dayToMonthDayString(energy_datum.day)] || 105,
                irradiance = base_day_irradiance * house.production_multiplier * day_multiplier;
              energy_datum.irradiance = irradiance;
            })
            return DB.EnergyDatum.bulkCreate(Array.from(energy_data.values()), {validate: true});
          });
        })
        .then(()=>{
          return house.getPowerData({order: 'time DESC', limit: 1});
        })
        .then((max_data)=>{
          house.data_until = max_data[0].time;
          return house.getPowerData({order: 'time ASC', limit: 1});
        }).then((min_data)=>{
          house.data_from = min_data[0].time;
          return house.save();
        });
    }
  },
  classMethods: {
    set: ()=>{
      House.associate();
    },
    associate: ()=>{
      House.hasMany(DB.PowerDatum, {as: 'PowerData'});
    }
  }
});

House.NAME = NAME;
module.exports = House;
