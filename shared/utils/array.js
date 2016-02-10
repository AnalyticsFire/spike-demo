class ArrayUtil {

  static diff(a1, a2){
    a1.filter((a1n)=>{ return a2.indexOf(a1n) < 0; });
  }

  static selectMap(a, fnSelect, fnMap){
    var map = [];
    for (var elem of a){
      if (fnSelect(elem)){
        map.push(fnMap(elem));
      }
    }
    return map;
  }

  static all(a, fnCondition){
    var all = true;
    for (var elem of a){
      if (!fnCondition(elem)){
        all = false;
        break;
      }
    }
    return all;
  }

}

export default ArrayUtil;
