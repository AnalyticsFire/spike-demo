import ArrayUtil from './../../../shared/utils/array';
import DateRange from './../../../shared/utils/date_range';
class EnergyDataApi {

  static index(params){
    if (params.houses){
      var promises = [],
        data = [];
      for (var opts of params.houses){
        var promise =  EnergyDataApi.getHouseData(opts)
          .then((res)=>{
            data.concat(res);
          });
        promises.push(promise);
      }
      return Promise.all(promises)
            .then(()=>{ return data; });
    } else {
      return EnergyDataApi.getHouseData(params);
    }
  }

  static getHouseData(params){
    return jQuery.ajax({
      url: '/data/energy_data/' + params.house_id + ".json",
      dataType: 'json'
    }).then((res)=>{
      return res.data.filter((energy_datum)=>{
        return ArrayUtil.any(params.dates, (range)=>{
          return DateRange.lte(range[0], energy_datum.day) && DateRange.gte(range[1], energy_datum.day)
        });
      });
    });

  }

}

export default EnergyDataApi;
