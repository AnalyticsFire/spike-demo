"use strict";

import moment from 'moment-timezone';
import House from './../../../../client/models/house.js';


describe('house#setMonthState', ()=>{

  var data_until = 1456589922, // Sat, 27 Feb 2016 16:18:42 +0000
    house = new House({
      id: 1,
      name: 'Johnson',
      data_from: data_until - 3600 * 24 * 365 * 3,
      data_until: data_until,
      timezone: 'America/New_York'
    });

  it('is updated properly on init', ()=>{
    var current_month_moment = moment.tz({year: 2016, month: 1, day: 1}, 'America/New_York'),
      energy_min = moment.tz({year: 2016, month: 0, day: 1}, 'America/New_York').unix(),
      energy_max = data_until,
      power_min = data_until - 3600 * 24 * 4,
      power_max = data_until;

    expect(house.state.month).toEqual('Feb');
    expect(house.state.year).toEqual(2016);
    expect(house.state.current_month_moment.unix()).toEqual(current_month_moment.unix());
    expect(house.state.energy_range).toEqual([energy_min, energy_max]);
    expect(house.state.power_range).toEqual([power_min, power_max]);
  });

  it('is not updated when passed no params', ()=>{
    var current_month_moment = moment.tz({year: 2016, month: 1, day: 1}, 'America/New_York'),
      energy_min = moment.tz({year: 2016, month: 0, day: 1}, 'America/New_York').unix(),
      energy_max = data_until,
      power_min = data_until - 3600 * 24 * 4,
      power_max = data_until;

    house.setMonthState({});
    expect(house.state.month).toEqual('Feb');
    expect(house.state.year).toEqual(2016);
    expect(house.state.current_month_moment.unix()).toEqual(current_month_moment.unix());
    expect(house.state.energy_range).toEqual([energy_min, energy_max]);
    expect(house.state.power_range).toEqual([power_min, power_max]);
  });

  it('is updated properly when passed power params', ()=>{
    var current_month_moment = moment.tz({year: 2015, month: 2, day: 1}, 'America/New_York'),
      energy_min = moment.tz({year: 2015, month: 0, day: 1}, 'America/New_York').unix(),
      energy_max = moment.tz({year: 2015, month: 0, day: 1}, 'America/New_York').endOf('year').unix(),
      power_max = current_month_moment.clone().endOf('month').subtract(3, 'days').unix(),
      power_min = current_month_moment.clone().endOf('month').subtract(6, 'days').unix()

    house.setMonthState({
      month: 'Mar',
      year: 2015
    }, [ power_min, power_max ]);

    expect(house.state.month).toEqual('Mar');
    expect(house.state.year).toEqual(2015);
    expect(house.state.current_month_moment.unix()).toEqual(current_month_moment.unix());
    expect(house.state.energy_range).toEqual([energy_min, energy_max]);
    expect(house.state.power_range).toEqual([power_min, power_max]);
  });

  it('is updated properly when passed energy params', ()=>{
    var current_month_moment = moment.tz({year: 2014, month: 9, day: 1}, 'America/New_York'),
      energy_min = moment.tz({year: 2014, month: 0, day: 1}, 'America/New_York').unix(),
      energy_max = moment.tz({year: 2014, month: 0, day: 1}, 'America/New_York').endOf('year').unix(),
      power_max = moment.tz({year: 2014, month: 9, day: 1}, 'America/New_York').endOf('month').unix(),
      power_min = power_max - 3600 * 24 * 4;

    house.setMonthState({
      month: 'Oct',
      year: 2014
    });

    expect(house.state.month).toEqual('Oct');
    expect(house.state.year).toEqual(2014);
    expect(house.state.current_month_moment.unix()).toEqual(current_month_moment.unix());
    expect(house.state.energy_range).toEqual([energy_min, energy_max]);
    expect(house.state.power_range).toEqual([power_min, power_max]);
  });

});
