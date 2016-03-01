import rt from 'react-templates';
import React from 'react';
import _ from 'lodash';

import {COMPONENT_MAP} from './component_map';

var TEMPLATES = {};

class Templates {

  static sync(){
    var all = [];
    for (var component_name in COMPONENT_MAP){
      var done = new Promise((fnResolve, fnReject)=>{
        Templates.evalTemplate(component_name, fnResolve);
      });
      all.push(done);
    }
    return Promise.all(all);
  }

  static forComponent(name){
    return TEMPLATES[name];
  }

  static evalTemplate(component_name, fnResolve){
    jQuery.ajax({
      url: COMPONENT_MAP[component_name] + '.rt'
    }).done((template)=>{
      var code = rt.convertTemplateToReact(template, {modules: 'none', name: component_name}),
        eval_context = {};
      code = code.replace('var ' + component_name + ' = ', 'eval_context.' + component_name + ' = ');
      new Function('with(this){ ' + code + ' } ').call({
        eval_context: eval_context,
        '_': _,
        'React': React
      });
      TEMPLATES[component_name] = eval_context[component_name];
      fnResolve();
    });
  }

}

export default Templates;
