import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

import Templates from 'config/templates';
import House from './../../models/house';
import DateRangeSlider from './../../d3/sliders/date_range';
import {RouteHelper} from './../routes';

class PowerComponent extends React.Component {

  constructor(props){
    super(props);
    var power = this;
    power.state = {
      loading_power_data: true };
    power.updates = 0;
  }

  componentDidMount(){
    var power = this,
      house = power.context.house;
    power.renders = 0;
    if (!house) return false;
    power.initDateRange();
    house.setPowerData()
      .then(()=>{
        power.setState({loading_power_data: false }); });
  }

  componentDidUpdate(prev_props, prev_state, prev_context){
    var power = this,
      house = power.context.house;
    if (!house) return false;
    var route_helper = new RouteHelper(house, power.props);
    if ((!prev_context.house || prev_context.house.data.id != power.context.house.data.id) ||
                                !house.matchesPowerRange(prev_props.location.query['dates[]'] || [])) {
      power.setState({loading_power_data: true});
      house.setPowerData()
        .then(()=>{
          power.initDateRange();
          power.setState({loading_power_data: false}); // will update graph or table.
        });
    } else if (!house.matchesMonthState(prev_props.params)) power.initDateRange();
  }

  initDateRange(){
    var power = this,
      house = power.context.house;
    if (power.date_range_slider === undefined){
      power.date_range_slider = new DateRangeSlider({
        container: '#power_date_setter',
        outer_height: 100,
        maxDelta: function(changed_date, other_date){
          if (Math.abs(changed_date.getTime() - other_date.getTime()) > 3600 * 24 * 4 * 1000){
            if (changed_date > other_date){
              return new Date(changed_date.getTime() - 3600 * 24 * 4 * 1000);
            } else {
              return new Date(changed_date.getTime() + 3600 * 24 * 4 * 1000);
            }
          }
          return false;
        }
      });
    }
    power.date_range_slider.onRangeUpdated = (min, max)=>{
      if (power.date_range_update) clearTimeout(power.date_range_update);
      power.date_range_update = setTimeout(()=>{
        var power_range = [Math.round(min.getTime() / 1000), Math.round(max.getTime() / 1000)],
          route_helper = new RouteHelper(house, power.props, {power_range: power_range});

        route_helper.updateHouseState();
        power.context.router.push(route_helper.newRoute());
      }, 500);
    };
    power.date_range_slider.drawData({
      abs_min: house.state.current_month_moment.toDate(),
      abs_max: house.state.end_of_current_data_moment.toDate(),
      current_min: house.toDate(house.state.power_range[0]),
      current_max: house.toDate(house.state.power_range[1])
    });
  }

  setParam(event){
    var power = this,
      house = power.context.house,
      param = event.target.dataset.param,
      value = event.target.dataset.value,
      update = {}, route_helper;
    update[param] = value;
    route_helper = new RouteHelper(house, power.props, update);
    if (route_helper.routeUpdated()){
      route_helper.updateHouseState();
      power.context.router.push(route_helper.newRoute());
    }
  }

  getChildContext(){
    var layout = this;
    return {
      loading_power_data: layout.state.loading_power_data
    };
  }

  render() {
    var powerRt = Templates.forComponent('power');
    return powerRt.call(this);
  }
}

PowerComponent.childContextTypes = {
  loading_power_data: React.PropTypes.bool.isRequired
};

PowerComponent.contextTypes = {
  house: React.PropTypes.instanceOf(House),
  router: React.PropTypes.object.isRequired
};

export default PowerComponent;
