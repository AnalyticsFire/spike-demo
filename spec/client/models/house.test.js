"use strict";

import moment from 'moment-timezone';
import House from './../../../client/models/house.js';

var data_until = 1456589922, // Sat, 27 Feb 2016 16:18:42 +0000
  house = new House({
    id: 1,
    name: 'Johnson',
    data_from: data_until - 3600 * 24 * 365 * 3, // 3 years before
    data_until: data_until,
    timezone: 'America/New_York'
  });

describe('House#state', ()=>{

  it('has no state after init', ()=>{
    expect(house.state).toEqual({});
  });

});

describe('house#verifyMonthState', ()=>{

  it('verifies to data_until month and year by default', ()=>{
    var params = {};
    house.verifyMonthState(params);
    expect(params.month).toEqual('Feb');
    expect(params.year).toEqual(2016);
  });

  it('verifies properly when passed valid params', ()=>{
    var params = {
      month: 'Mar',
      year: 2015
    };
    house.verifyMonthState(params);
    expect(params.month).toEqual('Mar');
    expect(params.year).toEqual(2015);
  });

  it('corrects for params outside of data range', ()=>{
    var params = {
      month: 'Mar',
      year: 2006
    };
    house.verifyMonthState(params);

    expect(params.month).toEqual('Mar');
    expect(params.year).toEqual(2013);
  });

});
describe('House#verifyPowerRange', ()=>{

  it('defaults to last four days of data', ()=>{
    var power_max = house.data.data_until,
      power_min = power_max - House.MAX_POWER_RANGE,
      power_range = house.verifyPowerRange([], {month: 'Feb', year: 2016});

    expect(power_range).toEqual([power_min, power_max]);
  });

  it('otherwise verifies power range to max 4 day range', ()=>{
    var power_max = moment.tz({year: 2014, month: 9, day: 1}, 'America/New_York').endOf('month').unix(),
      invalid_power_min = power_max - House.MAX_POWER_RANGE - 10,
      valid_power_min = power_max - House.MAX_POWER_RANGE,
      power_range = house.verifyPowerRange([invalid_power_min, power_max], {
        month: 'Oct',
        year: 2014
      });

    expect(power_range).toEqual([valid_power_min, power_max]);
  });

});
