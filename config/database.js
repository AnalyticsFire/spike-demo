"use strict";

var fs = require("fs"),
  models = [],
  model_path = __dirname + "/../models",
  files = fs.readdirSync(model_path),
  Sequelize = require("sequelize"),
  sequelize = new Sequelize("postgres://spikeuser:123456@localhost:5432/spike_proto", {
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

class Database {

  static sync(){

    // define each model
    for (var filename of files){
      var path = model_path + "/" + filename,
        stats = fs.statSync(path)
      if (stats.isFile()){
        models.push(require(path));
      }
    }

    // add associations
    for (var model of models){
      model.associate();
    }

    return sequelize.sync({force: true});
  }
}
Database.Sequelize = Sequelize;
Database.sequelize = sequelize;

export Database;
