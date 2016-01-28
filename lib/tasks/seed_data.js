import extend from "extend";
import moment from "moment";
import csv from "fast-csv";
import fs from 'fs';
import MathUtils from "./../utils/math"
import DB from './../../config/database';

export class PowerDataSeed {

  static saveCsv(opts, done){
    opts = extend({
      path: __dirname + "/../../data/example/power_data.csv"
    }, opts || {});
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['house_id', 'time', 'power']}),
      rows = [];

    csvStream.on("data", function(data){
      rows.push(rows);
    });
    csvStream.on("end", function(){
      DB.PowerDatum.bulkCreate(rows, {validate: true}).then(done);
    });
  }

  static generateCsv(opts, done){
    opts = extend({
      start_date: moment.subtract(1, "months").unix(),
      end_date: moment().unix(),
      interval: 15 * 60, // every 15 minutes (in s)
      average: 1400, // Wh
      path: __dirname + "/../../data/example/power_data.csv"
    }, opts || {});

    var row_date = opts.start_date,
      csvStream = csv.format({headers: true}),
      writableStream = fs.createWriteStream(opts.path);

    csvStream.pipe(writableStream);
    writableStream.on("finish", done);

    while (row_date <= end_date){
      csvStream.write(house_ids.map((house_id)=>{
        return [house_id, row_date, MathUtils.normal(opts.average)]
      }));
      row_date += opts.interval;
    }
    csvStream.end();
  }
}

export class HouseSeed {
  static saveCsv(opts, done){
    opts = extend({
      path: __dirname + "/../../data/example/houses.csv"
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
      DB.House.bulkCreate(rows, {validate: true}).then(done);
    });
  }
}

