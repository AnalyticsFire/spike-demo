import DB from './../config/database.js';

const NAME = 'EnergyController';

class EnergyController{

  static index(req, res){
    DB.EnergyDatum.exposeForHouseAtDates(req.query.house_id, req.query.dates).then((energy_data)=>{
      req.json({data: energy_data});
    });
  }

}

EnergyController.NAME = NAME;
module.exports = EnergyController;
