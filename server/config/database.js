"use strict";

import fs from "fs";
import Sequelize from 'sequelize';

var sequelize = new Sequelize("postgres://spikeuser:123456@localhost:5432/spike2", {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
const MODEL_DIR = __dirname + '/../models'

class Database {

  static sync(){
    console.log("syncing db")
    fs.readdirSync(MODEL_DIR).forEach(function(file) {
      var model = require(MODEL_DIR + '/' + file);
      Database[model.NAME] = model;
      Database.models.push(model);
    });

    // add associations
    for (var model of Database.models){
      model.set();
    }

    return sequelize.sync().then(()=>{ console.log("done syncing db") });
  }
}
Database.sequelize = sequelize;
Database.Sequelize = Sequelize;
Database.models = [];

export default Database;
