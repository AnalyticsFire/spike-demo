import DB from './../config/database.js';

const NAME = HousesController;

class HousesController{

  static index(req, res){
    DB.House.findAll({attributes: ['id', 'name']}).then((houses)=>{
      res.json(houses);
    });
  }

}

HousesController.NAME = NAME;
module.exports = HousesController;
