import DB from './../config/database.js';

const NAME = 'PowerController';

class PowerController{

  static index(req, res){
    DB.House.findOne({where: {name: req.housename}}).then((house)=>{
      house.getPowerDataByTime(req.params.start_time, req.params.end_time).then((power_data)=>{
        res.json(power_data);
      });
    });
  }

}

PowerController.NAME = NAME;
module.exports = PowerController;
