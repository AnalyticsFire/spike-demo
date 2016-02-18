import Loki from 'lokijs';

var db = new Loki('spike');

db.addCollection('PowerData');
db.addCollection('EnergyData');
db.addCollection('Houses');

export default
