import react_templates from 'react-templates/dist/reactTemplates';
import React from 'react';
import _ from 'lodash';

import {COMPONENT_MAP} from './component_map';

var TEMPLATES = {};

class Templates {

  static forComponent(name){
    return TEMPLATES[name];
  }

  static sync(){
    var all = [],
      eval_context = {
        '_': _,
        'React': React
      };
    for (var component_name in COMPONENT_MAP){
      var component = require('./../../' + COMPONENT_MAP[component_name] + '.component');
      eval_context[component.NAME] = component;
    }
    for (var component_name in COMPONENT_MAP){
      var done = new Promise((fnResolve, fnReject)=>{
        Templates.evalTemplate(component_name, eval_context, fnResolve);
      });
      all.push(done);
    }
    return Promise.all(all);
  }

  static evalTemplate(component_name, eval_context, fnResolve){
    jQuery.ajax({
      url: COMPONENT_MAP[component_name] + '.rt'
    }).done((template)=>{
      var code = react_templates.convertTemplateToReact(template, {modules: 'none', name: component_name}),
      code = code.replace('var ' + component_name + ' = ', 'this.' + component_name + ' = ');
      new Function('with(this){ ' + code + ' } ').call(eval_context);
      TEMPLATES[component_name] = eval_context[component_name];
      fnResolve();
    });
  }

}

export default Templates;
