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
      view: 'energy',
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

  setView: function(event){
    var layout = this,
      view = event.target.value;
    layout.view_name = event.target.innerText;
    layout.setState({view: view});
  },

  setHouse: function(event){
    var layout = this,
      house_id = event.target.value,
      house = layout.state.houses.find((house)=>{ return house.data.id == house_id });
    layout.setState({house: house});
  },

  render: function() {
    return layoutRt.call(this);
  }
});

export default Layout;
