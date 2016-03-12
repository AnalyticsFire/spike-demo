import fs from 'fs';

import FsHelper from './../fs_helper';
import DB from './../../config/database';

const DESIGN_DATA_PATH = __dirname + '/../../../client/build/design/data';

class DesignDataGenerator {

  constructor(house_ids, dates){
    var generator = this;
    generator.house_ids = house_ids;
    generator.dates = dates;
  }

  exec(){
    var generator = this;
    console.log('Clearing design data directory...')
    return generator.clearDirectory()
      .then(()=>{
        console.log('Writing house index response...')
        return generator.writeHouseIndex();
      })
      .then(()=>{
        console.log('Writing house energy and power data...');
        return generator.writeHouseData();
      })
      .then(()=>{
        console.log('Done!')
      });
  }

  clearDirectory(){
    console.log('DesignDataGenerator#clearDirectory')
    return new Promise((fnResolve1, fnReject1)=>{
      // remove directory & contents
      FsHelper.rmdirAsync(DESIGN_DATA_PATH, ()=>{
        // recreate it.
        fs.mkdir(DESIGN_DATA_PATH, ()=>{
          // create subdirectories
          Promise.all([
            new Promise((fnResolve2, fnReject2)=>{ fs.mkdir(DESIGN_DATA_PATH + '/energy_data', fnResolve2); }),
            new Promise((fnResolve2, fnReject2)=>{ fs.mkdir(DESIGN_DATA_PATH + '/power_data', fnResolve2); })
          ]).then(fnResolve1);
        });
      });
    });
  }

  writeHouseData(){
    var generator = this;
    return DB.House.findAll({where: {id: generator.house_ids}})
      .then((houses)=>{
        var promises = [];
        // for all houses, write energy and power responses.
        houses.forEach((house)=>{
          promises.push(new Promise((fnResolve, fnReject)=>{
            DesignDataGenerator.energyIndex({house_id: house.id, dates: [generator.dates]})
              .then((json)=>{
                fs.writeFile(DESIGN_DATA_PATH + `/energy_data/${house.id}.json`, json, fnResolve);
              });
          }));
          promises.push(new Promise((fnResolve, fnReject)=>{
            DesignDataGenerator.powerIndex({house_id: house.id, dates: [generator.dates]})
              .then((json)=>{
                fs.writeFile(DESIGN_DATA_PATH + `/power_data/${house.id}.json`, json, fnResolve);
              });
          }));
        });
        return Promise.all(promises);
      });
  }

  writeHouseIndex(){
    var generator = this;
    return new Promise((fnResolve, fnReject)=>{
      DesignDataGenerator.housesIndex({id: generator.house_ids, dates: generator.dates})
        .then((json)=>{
          fs.writeFile(DESIGN_DATA_PATH + '/houses.json', json, fnResolve);
        });
    });
  }

  static housesIndex(opts){
    return DB.House.findAll({where: {id: opts.id}})
            .then((houses_data)=>{
              if (opts.dates){
                houses_data.forEach((house_datum)=>{
                  house_datum.data_from = opts.dates[0];
                  house_datum.data_until = opts.dates[1];
                });
              }
              return JSON.stringify(houses_data, null, 2);
            });
  }

  static powerIndex(opts){
    return DB.PowerDatum.exposeForHouseAtDates(opts.house_id, opts.dates)
      .then((power_data)=>{
        return JSON.stringify({data: power_data});
      });
  }

  static energyIndex(opts){
    return DB.EnergyDatum.exposeForHouseAtDates(opts)
      .then((energy_data)=>{
        console.log('Energy data length')
        console.log(energy_data.length)
        return JSON.stringify({data: energy_data});
      });
  }

}

export default DesignDataGenerator;
