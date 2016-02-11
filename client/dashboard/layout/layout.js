import React from 'react';
import layoutRt from './layout.rt.js';
import House from './../../models/house';

const VIEWS = [['power', 'Power Savings'], ['energy', 'Energy Production']];

var Layout = React.createClass({

  getInitialState: function(){
    var layout = this;
    layout.view_name = VIEWS[0][1];
    return {
      views: VIEWS,
      houses: null,
      house: null,
      view: 'power',
      requesting_data: true
    };
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    var layout = this;
    // window.addEventListener('resize', this.handleResize);
    House.ensureHouses().then((houses)=>{
      layout.setState({houses: houses, house: houses[0]});
      layout.ensureHouseViewData();
    });
  },

  setView: function(event){
    var layout = this,
      view = event.target.value;
    layout.view_name = event.target.innerText;
    layout.setState({view: view}, function(){
      layout.ensureHouseViewData();
    });
  },

  setHouse: function(event){
    var layout = this,
      house_id = event.target.value,
      house = layout.state.houses.find((house)=>{ return house.data.id == house_id });
    layout.setState({house: house}, function(){
      layout.ensureHouseViewData();
    });
  },

  ensureHouseViewData: function(){
    var layout = this,
      house = layout.state.house,
      view = layout.state.view,
      request;
    layout.setState({requesting_data: true}, ()=>{
      if (view === 'power'){
        request = house.ensurePowerData();
      } else {
        request = house.ensureEnergyData();
      }
      request.then(()=>{
        console.log('data retrieved')
        layout.setState({requesting_data: false}, ()=>{
          console.log(layout.state.requesting_data);
        });
      });
    });
  },

  render: function() {
    return layoutRt.call(this);
  }
});

export default Layout;
