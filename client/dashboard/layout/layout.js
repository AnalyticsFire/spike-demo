import React from 'react';

import layoutRt from './layout.rt.js';

var Layout = React.createClass({

  getInitialState: function(){
    return {view: "????"};
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  setView: function(event) {
    var layout = this;
    console.log(event.target.value)
    layout.setState({view: event.target.value});
  },

  render: function() {
    return layoutRt.call(this);
  }
});

export default Layout;
