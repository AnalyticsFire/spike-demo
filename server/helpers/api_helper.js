class ApiHelper {

  // assume all dates from api coming as UNIX timestamps.
  static datesParamToSequelize(dates, field_name){
    if (!dates) return {};
    var params = {};

    if (dates.length > 1){
      params['$or'] = [];
      dates.forEach((min_max)=>{
        var condition_n = {};
        condition_n[field_name] = {};
        if (min_max[0]) condition_n[field_name]['$gt'] = min_max[0];
        if (min_max[1]) condition_n[field_name]['$lt'] = min_max[1];
        if (Object.keys(condition_n).length) params['$or'].push(condition_n);
      });
    } else {
      var min_max = dates[0],
        condition = {}
      if (min_max[0]) condition['$gt'] = min_max[0];
      if (min_max[1]) condition['$lt'] = min_max[1];
      if (Object.keys(condition).length) params[field_name] = condition;
    }
    return params;
  }

}

export default ApiHelper;
