// All react templates should be pre-compiled for development.
// run 'gulp compile_react_templates'

import fs from 'fs';

import aboutRt from './../../dashboard/about/about.rt.js';
import houseRt from './../../dashboard/house/house.rt.js';
import layoutRt from './../../dashboard/layout/layout.rt.js';
import energyRt from './../../dashboard/energy/energy.rt.js';
import energyGraphRt from './../../dashboard/energy/graph/graph.rt.js';
import energyTableRt from './../../dashboard/energy/table/table.rt.js';
import powerRt from './../../dashboard/power/power.rt.js';
import powerGraphRt from './../../dashboard/power/graph/graph.rt.js';
import powerTableRt from './../../dashboard/power/table/table.rt.js';

const TEMPLATES = {
  about: aboutRt,
  house: houseRt,
  layout: layoutRt,
  energy: energyRt,
  energy_graph: energyGraphRt,
  energy_table: energyTableRt,
  power: powerRt,
  power_graph: powerGraphRt,
  power_table: powerTableRt
};

class Templates {

  static forComponent(view){
    return TEMPLATES[view];
  }

}

export default Templates;
