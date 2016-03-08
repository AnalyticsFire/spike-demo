import DB from "./../config/database";
import extend from 'extend';
import ApiHelper from './../lib/api_helper';

const NAME = 'EnergyDatum';

/**
 * Define your own types here
 */

var EnergyDatum = DB.sequelize.define(NAME, {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  day: {
    type: DB.Sequelize.INTEGER,
  },
  irradiance: DB.Sequelize.FLOAT,
  production: DB.Sequelize.FLOAT,
  consumption: DB.Sequelize.FLOAT
}, {
  paranoid: true,
  underscored: true,
  tableName: "energy_data",
  instanceMethods: {},
  classMethods: {
    set: ()=>{
      EnergyDatum.associate();
    },
    associate: ()=>{
      EnergyDatum.belongsTo(DB.House);
    },
    exposeForHouseAtDates: (house_id, dates)=>{
      var params = {house_id: house_id};
      extend(params, ApiHelper.datesParamToSequelize(dates, 'day'));
      return EnergyDatum.findAll({
        where: params,
        attributes: ['id', 'production', 'consumption', 'day']
      }).then((energy_data)=>{
        return energy_data.map((energy_datum)=>{
          return energy_datum.dataValues;
        });
      });
    }
  }
});

EnergyDatum.NAME = NAME;
module.exports = EnergyDatum;
