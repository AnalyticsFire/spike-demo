import layoutRt from './layout.rt.js';

var Layout = React.createClass({
  getInitialState: function() {
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  setView: function(event) {
    var layout = this;
    layout.setState({view: event.target.value});
  },

  render: function() {
    return layoutRt.bind(this);
  }
});

export default Layout;
