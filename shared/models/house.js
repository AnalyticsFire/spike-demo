import moment from 'moment';

class House {

  timeToDateString(timestamp){
    var house = this;
    return moment.tz(timestamp, house.timezone).format("YYYY-MM-DD");
  }

}
