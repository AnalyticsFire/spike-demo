"use strict";
var Database = require("./../config/database");

class Datum {
  static associate(){
    var Country = require("./country");
    this.sql.belongsTo(Country.sql, {foreignKey: "country_id", targetKey: "id", constraints: false});
  }
}

Datum.sql = Database.sequelize.define('Datum', {
  id: {
    type: Database.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  country_id: {
    type: Database.Sequelize.INTEGER,
    unique: "country_year",
    references: {
      model: "countries",
      key: "id",
      allowNull: false
    }
  },
  year: {
    type: Database.Sequelize.INTEGER,
    unique: "country_year",
    allowNull: false
  },
  population: Database.Sequelize.BIGINT,
  gdp: Database.Sequelize.FLOAT,
  total_emissions: Database.Sequelize.FLOAT,
  energy_emissions: Database.Sequelize.FLOAT,
  industrial_emissions: Database.Sequelize.FLOAT,
  agriculture_emissions: Database.Sequelize.FLOAT,
  waste_emissions: Database.Sequelize.FLOAT,
  lucf_emissions: Database.Sequelize.FLOAT,
  energy: Database.Sequelize.FLOAT
}, {tableName: "data"});

Datum.graphql = new GraphQLObjectType({
  name: "Datum",
  description: "A world country",
  fields: ()=>{
    year: {
      type: new GraphQLNonNull(GraphQLString)
    },
    population: {
      type: GraphQLInteger
    },
    gdp: {
      type: GraphQLFloat
    },
    total_emissions: {
      type: GraphQLFloat
    },
    energy_emissions: {
      type: GraphQLFloat
    },
    industrial_emissions: {
      type: GraphQLFloat
    },
    agriculture_emissions: {
      type: GraphQLFloat
    },
    waste_emissions: {
      type: GraphQLFloat
    },
    lucf_emissions: {
      type: GraphQLFloat
    }
  }

});


module.exports = Datum;
