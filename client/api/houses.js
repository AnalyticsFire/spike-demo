const ENDPOINT = '/data/v1/houses';
import extend from 'extend';

class HousesApi {

  static index(params){
    return jQuery.ajax({
      url: ENDPOINT + '?' + jQuery.param(params),
      type: 'GET',
      dataType: 'json'
    }).then((res)=>{
      return res.data;
    });
  }

}

export default HousesApi;
