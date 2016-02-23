import rt from 'react-templates';
import React from 'react';
import _ from 'lodash';

import Energy from './../../dashboard/energy/energy';
import Power from './../../dashboard/power/power';

const TEMPLATE_ROUTES = Object.freeze({
  energy: 'dashboard/energy/energy.rt',
  layout: 'dashboard/layout/layout.rt',
  power: 'dashboard/power/power.rt'
});

const COMPONENTS = {
  Power: Power,
  Energy: Energy
};

var TEMPLATES = {};

class Templates {

  static sync(){
    var all = [];
    for (var view in TEMPLATE_ROUTES){
      var done = new Promise((fnResolve, fnReject)=>{
          Templates.evalTemplate(view, fnResolve);
      });
      all.push(done);
    }
    return Promise.all(all);
  }

  static forComponent(view){
    return TEMPLATES[view];
  }

  static evalTemplate(view, fnResolve){
    jQuery.ajax({
      url: TEMPLATE_ROUTES[view]
    }).done((template)=>{
      var code = rt.convertTemplateToReact(template, {modules: 'none', name: view}),
        context = {};
      code = code.replace('var '+view+' = ', 'context.'+view+' = ');
      new Function('with(this){ ' + code + ' } ').call({
        Energy: Energy,
        Power: Power,
        context: context,
        '_': _,
        'React': React
      });
      TEMPLATES[view] = context[view];
      fnResolve();
    });
  }

}

export default Templates;
