const ENDPOINT = '/data/v1/energy';
import extend from 'extend';

class EnergyDataApi {

  static index(params){
    params = extend({

    }, params);
    return jQuery.ajax({
      url: `${ENDPOINT}`,
      type: 'GET',
      params: params,
      dataType: 'json'
    }).success((res)=>{
      return res.data;
    });
  }

}

export default EnergyDataApi;
