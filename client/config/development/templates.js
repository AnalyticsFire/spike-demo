// All react templates should be pre-compiled for development.
// run 'gulp compile_react_templates'

import fs from 'fs';

import aboutRt from './../../dashboard/about/about.rt';
import houseRt from './../../dashboard/house/house.rt';
import layoutRt from './../../dashboard/layout/layout.rt';
import energyRt from './../../dashboard/energy/energy.rt';
import energyGraphRt from './../../dashboard/energy/graph/graph.rt';
import energyTableRt from './../../dashboard/energy/table/table.rt';
import powerRt from './../../dashboard/power/power.rt';
import powerGraphRt from './../../dashboard/power/graph/graph.rt';
import powerTableRt from './../../dashboard/power/table/table.rt';

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
