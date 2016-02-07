import Controllers from 'controllers'

export default function(app){

  app.use('/data/v1/savings/:housename', Controllers.Energy.savings);
  app.use('/data/v1/production/:housename', Controllers.Energy.production);
  app.use('/data/v1/houses/:housename');

};
