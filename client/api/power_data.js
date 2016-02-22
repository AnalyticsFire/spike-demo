const ENDPOINT = '/data/v1/power';
import extend from 'extend';

// send all date parameters as unix timestamps;
class PowerDataApi {

  static index(params){
    return jQuery.ajax({
      url: ENDPOINT  + '?' + jQuery.param(params),
      type: 'GET',
      dataType: 'json'
    }).then((res)=>{
      return res.data;
    });
  }

}

export default PowerDataApi;

