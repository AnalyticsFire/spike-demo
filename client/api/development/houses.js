import extend from 'extend';

const ENDPOINT = '/data/v1/houses';

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
