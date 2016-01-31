import extend from "extend";
import moment from "moment";
import csv from "fast-csv";
import fs from 'fs';
import MathUtils from "./../utils/math"
import DB from './../../config/database';

export class PowerDataSeed {

  static saveCsv(opts, done){
    opts = extend({
      path: __dirname + "/../../data/power_data.csv"
    }, opts || {});
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['house_id', 'time', 'power']}),
      rows = [];

    csvStream.on("data", function(data){
      data.time = moment.utc(parseInt(data.time)).format();
      rows.push(data);
      if (rows.length % 100 === 0){
        DB.PowerDatum.bulkCreate(rows, {validate: true}).then(()=>{
          rows = [];
        });
      }
    });
    csvStream.on("end", function(){
      DB.PowerDatum.bulkCreate(rows, {validate: true}).then(()=>{
        console.log("DONE!")
        done();
      });
    });
  }

  static generateCsv(opts, done){
    opts = extend({
      start_date: moment().subtract(2, "months").unix(),
      end_date: moment().unix(),
      interval: 180, // every 3 minutes (in s)
      average: 1400, // Wh
      path: __dirname + "/../../data/power_data.csv"
    }, opts || {});

    var row_date = opts.start_date,
      csvStream = csv.format({headers: true}),
      writableStream = fs.createWriteStream(opts.path),
      house_ids = opts.house_ids.split(",")

    csvStream.pipe(writableStream);
    writableStream.on("finish", ()=>{
      console.log("DONE!")
      done();
    });

    while (row_date <= opts.end_date){
      for (var house_id of house_ids){
        csvStream.write([house_id, row_date, MathUtils.normal(opts.average)]);
      }
      row_date += opts.interval;
    }
    csvStream.end();
  }
}

export class HouseSeed {
  static saveCsv(opts, done){
    opts = extend({
      path: __dirname + "/../../data/houses.csv"
    }, opts || {});
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['id', 'name']}),
      rows = [];

    csvStream.on("data", function(data){
      console.log(JSON.stringify(data))
      rows.push(data);
    });
    csvStream.on("end", function(){
      console.log(rows);
      DB.House.bulkCreate(rows, {validate: true}).then(()=>{
        console.log("DONE!")
        done();
      });
    });
  }
}

export class UserSeed {
  static saveCsv(opts, done){
    opts = extend({
      path: __dirname + "/../../data/users.csv"
    }, opts || {});
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['username', 'house_id']}),
      rows = [];

    csvStream.on("data", function(data){
      console.log(JSON.stringify(data))
      rows.push(data);
    });
    csvStream.on("end", function(){
      console.log(rows);
      DB.User.bulkCreate(rows, {validate: true}).then(()=>{
        console.log("DONE!")
        done();
      });
    });
  }
}
