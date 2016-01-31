"use strict";

import fs from "fs";
import Sequelize from 'sequelize';

var sequelize = new Sequelize("postgres://spikeuser:123456@localhost:5432/spike_proto", {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
const model_dir = __dirname + '/../models'

class Database {

  static sync(){

    fs.readdirSync(model_dir).forEach(function(file) {
      model = require(model_dir + '/' + file);
      Database[model.name] = model;
      Database.models.push(model);
    });

    // add associations
    for (var model of Database.models){
      model.associate();
    }

    return sequelize.sync({force: true});
  }
}
Database.sequelize = sequelize;
Database.Sequelize = Sequelize;
Database.models = [];

export default Database;
