import rt from 'react-templates';
import Energy from './../../dashboard/energy/energy';
import Power from './../../dashboard/power/power';

const TEMPLATE_ROUTES = Object.freeze({
  energy: 'dashboard/energy/energy.html',
  layout: 'dashboard/energy/layout.html',
  power: 'dashboard/energy/power.html'
});

var TEMPLATES = {};

class Templates {

  static sync(){
    var all = [];
    for (var view in TEMPLATE_ROUTES){
      var done = new Promise((fnResolve, fnReject)=>{
        jQuery.ajax({
          url: TEMPLATE_ROUTES[view]
        }).done((template)=>{
          eval(rt.convertTemplateToReact(template, {modules: 'none'}));
          TEMPLATES[view] = eval(view);
          fnResolve();
        });
      });
      all.push(done);
    }
    return Promise.all(all);
  }

  static forComponent(view){
    return TEMPLATES[view];
  }

}
