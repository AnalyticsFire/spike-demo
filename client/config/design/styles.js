const STYLE_ROUTES = Object.freeze({
  energy: 'dashboard/energy/energy.scss',
  layout: 'dashboard/layout/layout.scss',
  power: 'dashboard/power/power.scss',
  app: 'dashboard/app.scss'
});

class Styles {

  static sync(){
    var all = [],
      css = '';
    for (var view in STYLE_ROUTES){
      var done = new Promise((fnResolve, fnReject)=>{
        Styles.addCss(view, fnResolve)
      }).then((result)=>{
        css += result;
      });
      all.push(done);
    }
    return Promise.all(all)
      .then(()=>{
        jQuery('head').append(`<style>${css}</style>`);
      });
  }

  static addCss(view, fnResolve){
    return jQuery.ajax({
      url: STYLE_ROUTES[view]
    }).then((scss)=>{
      var sass = new Sass();
      if (!scss) return fnResolve("");
      sass.compile(scss, (result, a)=>{
        fnResolve(result.text)
      });
    });
  }

}

export default Styles;

