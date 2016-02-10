import DB from "./../config/database";
import extend from 'extend';
import ApiHelper from './../helpers/api_helper';

const NAME = 'PowerDatum';

/**
 * Define your own types here
 */

var PowerDatum = DB.sequelize.define(NAME, {
  id: {
    type: DB.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  time: DB.Sequelize.DATE,
  consumption: DB.Sequelize.FLOAT,
  production: DB.Sequelize.FLOAT
}, {
  paranoid: true,
  underscored: true,
  tableName: "power_data",
  instanceMethods: {
    exposeToApi: function(){
      var power_datum = this,
        data = power_datum.dataValues;
      data.consumption = data.consumption * 4; // convert Wh / 15 minutes, to W
      data.production = data.production * 4; // convert Wh / 15 minutes, to W
      return data;
    }
  },
  classMethods: {
    exposeForHouseAtDates: (house_id, dates)=>{
      var params = {house_id: house_id};
      params = extend(params, ApiHelper.datesParamToSequelize(dates, 'time'));
      console.log(params);
      return PowerDatum.findAll({
        where: params,
        attributes: ['id', 'production', 'consumption', 'time']
      }).then((power_data)=>{
        return power_data.map((power_datum)=>{
          return power_datum.exposeToApi();
        });
      });
    },
    set: ()=>{
      PowerDatum.associate();
    },
    associate: ()=>{
      PowerDatum.belongsTo(DB.House);
    }
  }
});

PowerDatum.NAME = NAME;
module.exports = PowerDatum;
