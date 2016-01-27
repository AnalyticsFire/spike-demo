"use strict";
var Database = require("./../config/database");

class Country {

  static associate(){
    var Datum = require("./datum");
    this.sql.hasOne(Datum.sql, {as: "Data", foreignKey: "id", constraints: false});
  }

};

Country.sql = Database.sequelize.define('Country', {
  id: {
    type: Database.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  name: {
    type: Database.Sequelize.STRING,
    unique: true,
    allowNull: false
  }
}, {tableName: "countries"});

Country.graphql = new GraphQLObjectType({
  name: "Country",
  description: "A world country",
  fields: ()=>{
    id: {
      type: new GraphQLNonNull(GraphQLInteger)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    data: {
      type: new GraphQLList(Datum.graphql),
      args: {
        year: {
          type: GraphQLList(GraphQLInteger)
        }
      },
      resolve: (country, args)=>{
        debugger
        if (args.year){
          country.getData({where: args});
        } else {
          country.getData();
        }
      }
    }
});

module.exports = Country;
