import extend from "extend";
import moment from "moment";
import csv from "fast-csv";
import fs from 'fs';
import MathUtils from "./../../../shared/utils/math"
import DB from './../../config/database';

const DATA_PATH = __dirname + '/../../data/'

export class PowerDataSeed {

  static saveCsv(opts, done){
    opts = extend({
      path: "power_data.csv",
      house_id: null
    }, opts || {});
    opts.path = DATA_PATH + opts.path;
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['time', 'consumption', 'production']}),
      rows = [];

    csvStream.on("data", function(data){
      data.house_id = opts.house_id
      rows.push(data);
      if (rows.length % 100 === 0){
        DB.PowerDatum.bulkCreate(rows, {validate: true}).catch((error)=>{
          console.error(JSON.stringify(error));
          console.error(JSON.stringify(rows));
        });
        rows = [];
      }
    });
    csvStream.on("end", function(){
      console.log("all rows parsed")
      DB.PowerDatum.bulkCreate(rows, {validate: true}).then(()=>{
        return DB.House.findOne({where: {id: opts.house_id}}).then((house)=>{
          return house.aggregatePowerToEnergyData();
        });
      }).then(()=>{
        console.log("DONE!")
      });
    });
  }

  static generateCsv(opts, done){
    opts = extend({
      start_date: moment().subtract(120, "months").unix(),
      end_date: moment().unix(),
      interval: 900, // every 15 minutes (in s)
      average: 1400, // Wh
      path: "power_data.csv"
    }, opts || {});
    opts.path = DATA_PATH + opts.path;
    opts.production_multiplier = parseFloat(opts.production_multiplier);

    var row_date = opts.start_date,
      csvStream = csv.format({headers: true}),
      writableStream = fs.createWriteStream(opts.path);

    csvStream.pipe(writableStream);
    writableStream.on("finish", ()=>{
      console.log("DONE!")
      done();
    });

    DB.House.findOne({where: {id: opts.house_id}})
      .then((house)=>{
        while (row_date <= opts.end_date){
          var consumption =  MathUtils.normal(opts.average),
            production = MathUtils.normal(opts.average) * house.productionMultiplier(row_date * 1000);
          csvStream.write([row_date, consumption, production]);
          row_date += opts.interval;
        }
        csvStream.end();
      })
  }
}

export class HouseSeed {
  static saveCsv(opts, done){
    opts = extend({
      path: DATA_PATH + "houses.csv"
    }, opts || {});
    var stream = fs.createReadStream(opts.path),
      csvStream = csv.fromStream(stream, {headers: ['id', 'name', 'production_multiplier', 'timezone']}),
      rows = [];

    csvStream.on("data", function(data){
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
