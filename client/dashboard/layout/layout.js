import React from 'react';
import layoutRt from './layout.rt.js';
import House from './../../models/house';
import PowerDatum from './../../models/power_datum';

var Layout = React.createClass({

  getInitialState: function(){
    var layout = this;
    return {
      houses: null,
      house: null,
      view: 'graph',
      dataset: 'power',
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
      layout.setState({houses: houses, house: houses[0], requesting_data: false});
    });
  },

  setHouse: function(event){
    var layout = this,
      house_id = event.target.value,
      house = layout.state.houses.find((house)=>{ return house.data.id == house_id });
    layout.setState({house: house}, ()=>{
      house.closeDb();
    });
  },

  setView: function(event){
    var layout = this,
      view = event.target.dataset.value;
    layout.view_name = event.target.innerText;
    layout.setState({view: view});
  },

  setDataset: function(event){
    var layout = this,
      dataset = event.target.dataset.value;
    layout.setState({dataset: dataset});
  },

  refreshData: function(){
    var layout = this,
      houses = layout.state.houses,
      all = [];
    houses.forEach((house)=>{
      all.push(house.clearData());
    });
    Promise.all(all)
      .then(()=>{
        window.location.reload();
      });
  },

  render: function() {
    return layoutRt.call(this);
  }
});

export default Layout;
