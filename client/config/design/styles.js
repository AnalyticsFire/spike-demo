import {COMPONENT_MAP} from './component_map';

class Styles {

  static sync(){
    var all = [],
      css = '';
    for (var view in COMPONENT_MAP){
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
      url: COMPONENT_MAP[view] + '.scss'
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

