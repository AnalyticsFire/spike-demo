import sass from 'sass';

const STYLE_ROUTES = Object.freeze({
  energy: 'dashboard/energy/energy.scss',
  layout: 'dashboard/energy/layout.scss',
  power: 'dashboard/energy/power.scss'
});

class Styles {

  static sync(){
    var all = [],
      css = '';
    for (var view in STYLE_ROUTES){
      var done = new Promise((fnResolve, fnReject)=>{
        jQuery.ajax({
          url: STYLE_ROUTES[view]
        }).done((scss)=>{
          sass.compile(scss, (result)=>{
            css += result;
            fnResolve()
          });
        });
      });
      all.push(done);
    }
    return Promise.all(all)
      .then(()=>{
        document.write(`<style>${css}</style>`);
      });
  }

}


