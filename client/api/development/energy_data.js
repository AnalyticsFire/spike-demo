import extend from 'extend';

const ENDPOINT = '/data/v1/energy';

class EnergyDataApi {

  static index(params){
    return jQuery.ajax({
      url: ENDPOINT,
      data: JSON.stringify(params),
      contentType: 'application/json',
      type: 'POST',
      dataType: 'json'
    }).then((res)=>{
      return res.data;
    });
  }

}

export default EnergyDataApi;
