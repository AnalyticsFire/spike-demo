import DB from "./../config/database";

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
  day: DB.Sequelize.DATEONLY,
  production: DB.Sequelize.FLOAT,
  consumption: DB.Sequelize.FLOAT
}, {
  paranoid: true,
  underscored: true,
  tableName: "energy_data",
  instanceMethods: {

  },
  classMethods: {
    set: ()=>{
      EnergyDatum.associate();
    },
    associate: ()=>{
      EnergyDatum.belongsTo(DB.House);
    }
  }
});

EnergyDatum.name = NAME;
module.exports = EnergyDatum;
