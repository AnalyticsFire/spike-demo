import {COMPONENT_MAP} from './component_map';

class Styles {

  static sync(){
    var all = [],
      css = '';
    for (var view in COMPONENT_MAP){
      var done = new Promise((fnResolve, fnReject)=>{
        Styles.addCss(view, fnResolve)
      }).then((result)=>{
        if (result) css += result;
      });
      all.push(done);
    }
    all.push(Styles.addAppCss()
      .then((result)=>{ if(result)css += result; }));
    return Promise.all(all)
      .then(()=>{
        jQuery('head').append(`<style>${css}</style>`);
      });
  }

  static addCss(view, fnResolve){
    return jQuery.ajax({
      url: COMPONENT_MAP[view] + '.scss'
    })
    .fail(()=>{
      fnResolve('');
    })
    .then((scss)=>{
      var sass = new Sass();
      if (!scss) return fnResolve("");
      sass.compile(scss, (result, a)=>{
        fnResolve(result.text)
      });
    });
  }

  static addAppCss(){
    return new Promise((fnResolve, fnReject)=>{
      jQuery.ajax({
        url: '/dashboard/app.scss'
      })
      .fail(()=>{
        fnResolve('');
      })
      .then((scss)=>{
        var sass = new Sass();
        sass.compile(scss, (result, a)=>{
          fnResolve(result.text);
        });
      });
    });
  }

}

export default Styles;

