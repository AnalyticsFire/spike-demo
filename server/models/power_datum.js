import DB from "./../config/database";

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

  },
  classMethods: {
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
