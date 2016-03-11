import DB from './../config/database.js';

const NAME = 'EnergyController';

class EnergyController{

  static index(req, res){
    console.log ('EnergyController.index');
    console.log(JSON.stringify(req.body))
    console.log(JSON.stringify(req.params))
    console.log(JSON.stringify(req.query))
    DB.EnergyDatum.exposeForHouseAtDates(req.body)
      .then((energy_data)=>{
        res.json({data: energy_data});
      });
  }

}

EnergyController.NAME = NAME;
module.exports = EnergyController;
