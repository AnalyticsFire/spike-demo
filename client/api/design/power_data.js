import ArrayUtil from './../../../shared/utils/array';
import DateRange from './../../../shared/utils/date_range';

class PowerDataApi {

  static index(params){
    return jQuery.ajax({
      url: '/data/power_data/' + params.house_id + ".json",
      dataType: 'json'
    }).then((res)=>{
      return res.data.filter((power_datum)=>{
        return ArrayUtil.any(params.dates, (range)=>{
          return DateRange.lte(range[0], power_datum.time) && DateRange.gte(range[1], power_datum.time)
        });
      });
    });
  }

}

export default PowerDataApi;

