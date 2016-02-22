import Controllers from './config/controllers'

export default function(app){

  Controllers.sync();

  app.use('/data/v1/power', Controllers.PowerController.index);
  app.use('/data/v1/energy', Controllers.EnergyController.index);
  app.use('/data/v1/houses', Controllers.HousesController.index);

};
