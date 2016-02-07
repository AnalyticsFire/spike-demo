import DB from './../config/database.js';

class HousesController{

  static index(req, res){
    DB.House.findAll({attributes: ['id', 'name']}).then((houses){
      res.json(houses);
    });
  }

}
