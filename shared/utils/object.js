class ObjectUtil {

  static filterKeys(obj, keys){
    return Object.keys(obj).reduce((filtered, key)=>{
      if (keys.indexOf(key) >= 0) filtered[key] = obj[key]
      return filtered;
    }, {});
  }

}

export default ObjectUtil;
