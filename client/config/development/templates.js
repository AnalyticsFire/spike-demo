// All react templates should be pre-compiled for development.
// run 'gulp compile_react_templates'

import layoutRt from './../../dashboard/layout/layout.rt.js';
import energyRt from './../../dashboard/energy/energy.rt.js';
import powerRt from './../../dashboard/power/power.rt.js';

const TEMPLATES = Object.freeze({
  layout: layoutRt,
  energy: energyRt,
  power: powerRt,
});

class Templates {

  static forComponent(view){
    return TEMPLATES[view];
  }

}

export default Templates;
