import DB from './../config/database.js';

const NAME = 'EnergyController';

class EnergyController{

  static index(req, res){
    DB.House.findOne({where: {name: req.housename}}).then((house)=>{
      house.getEnergyDataByTime(req.params.start_time, req.params.end_time).then((energy_data)=>{
        req.json(energy_data);
      });
    });
  }

}

EnergyController.NAME = NAME;
module.exports = EnergyController;
