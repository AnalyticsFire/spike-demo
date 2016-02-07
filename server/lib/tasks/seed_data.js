import extend from "extend";
import moment from "moment";
import csv from "fast-csv";
import fs from 'fs';
import MathUtils from "./../../../shared/utils/math"
import DB from './../../config/database';

const DATA_PATH = __dirname + '/../../../shared/data/'

export class PowerDataSeed {

  static saveCsv(opts, done){
    opts = extend({
      path: DATA_PATH + "power_data.csv"
    }, opts || {});
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['house_id', 'time', 'consumption', 'production']}),
      rows = [];

    csvStream.on("data", function(data){
      data.time = moment.utc(parseInt(data.time * 1000)).format();
      rows.push(data);
      if (rows.length % 100 === 0){
        DB.PowerDatum.bulkCreate(rows, {validate: true}).then(()=>{
          rows = [];
        });
      }
    });
    csvStream.on("end", function(){
      console.log("all rows parsed")
      DB.PowerDatum.bulkCreate(rows, {validate: true}).then(()=>{
        return DB.House.findAll().then((houses)=>{
          var promise = Promise.resolve();

          for (var house of houses){
            promise = promise.then(()=>{
              return house.aggregatePowerToEnergyData();
            });
          }
          return promise;
        });
      }).then(()=>{
        console.log("DONE!")
      });
    });
  }

  static generateCsv(opts, done){
    opts = extend({
      start_date: moment().subtract(2, "months").unix(),
      end_date: moment().unix(),
      interval: 900, // every 15 minutes (in s)
      average: 1400, // Wh
      path: DATA_PATH + "power_data.csv"
    }, opts || {});

    var row_date = opts.start_date,
      csvStream = csv.format({headers: true}),
      writableStream = fs.createWriteStream(opts.path),
      house_ids = opts.house_ids.split(",")

    DB.House.findAll({where: {id: house_ids}}).then((houses)=>{

      csvStream.pipe(writableStream);
      writableStream.on("finish", ()=>{
        console.log("DONE!")
        done();
      });

      while (row_date <= opts.end_date){
        for (var house of houses){
          var consumption =  MathUtils.normal(opts.average),
            production = MathUtils.normal(opts.average) * house.productionMultiplier(row_date * 1000);
          csvStream.write([house.id, row_date, consumption, production]);
        }
        row_date += opts.interval;
      }
      csvStream.end();
    });
  }
}

export class HouseSeed {
  static saveCsv(opts, done){
    opts = extend({
      path: DATA_PATH + "houses.csv"
    }, opts || {});
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['id', 'name', 'timezone']}),
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
