class HousesApi {

  static index(params){
    return jQuery.ajax({
      url: '/data/houses.json',
      dataType: 'json'
    })
    .then((res)=>{
      return res.data;
    });
  }

}

export default HousesApi;
