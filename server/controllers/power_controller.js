import DB from './../config/database.js';

const NAME = 'PowerController';

class PowerController{

  static index(req, res){
    DB.PowerDatum.exposeForHouseAtDates(req.query.house_id, req.query.dates).then((power_data)=>{
      res.json({data: power_data});
    });
  }

}

PowerController.NAME = NAME;
module.exports = PowerController;
