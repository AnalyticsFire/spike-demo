import Controllers from './config/controllers'

export default function(app){

  Controllers.sync();

  app.use('/data/v1/savings/:housename', Controllers.PowerController.index);
  app.use('/data/v1/production/:housename', Controllers.EnergyController.index);
  app.use('/data/v1/houses/', Controllers.EnergyController.index);

};
