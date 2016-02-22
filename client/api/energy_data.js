import extend from 'extend';

const ENDPOINT = '/data/v1/energy';

// send all date parameters as unix timestamps;
class EnergyDataApi {

  static index(house, params){
    params = extend({
    }, params);
    if (params.dates){
      params.dates = params.dates.map((date_range)=>{
        if (date_range[0]) date_range[0] = date_range[0].unix();
        if (date_range[1]) date_range[1] = date_range[1].unix();
        return [date_range[0], date_range[1]];
      })
    }
    return jQuery.ajax({
      url: ENDPOINT + '?' + jQuery.param(params),
      type: 'GET',
      dataType: 'json'
    }).then((res)=>{
      return res.data;
    });
  }

}

export default EnergyDataApi;
