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
    exposeForHouseAtDates: (query)=>{
      var attributes = ['id', 'production', 'irradiance', 'consumption', 'day'],
        params = {};
      if (query.houses){
        attributes.push('house_id');
        params['$or'] = []
        query.houses.forEach((house_query)=>{
          var house_params = {house_id: house_query.house_id};
          extend(house_params, ApiHelper.datesParamToSequelize(house_query.dates, 'day'));
          params['$or'].push(house_params);
        });
      } else {
        params.house_id = query.house_id;
        extend(params, ApiHelper.datesParamToSequelize(query.dates, 'day'));
      }

      return EnergyDatum.findAll({
        where: params,
        attributes: attributes
      }).then((energy_data)=>{
        return energy_data.map(energy_datum => energy_datum.dataValues);
      });
    }
  }
});

EnergyDatum.NAME = NAME;
module.exports = EnergyDatum;
