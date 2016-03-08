import DB from './../config/database.js';

const NAME = 'HousesController';

class HousesController {

  static index(req, res){
    var params = {};
    if (req.query.ids) params.id = ids;
    DB.House.findAll({where: params}).then((houses)=>{
      res.json({data: houses.map((house)=>{ return house.dataValues; })});
    });
  }

}

HousesController.NAME = NAME;
module.exports = HousesController;
