import React from 'react';
import Templates from 'config/templates';

class AboutComponent extends React.Component {

  render() {
    var aboutRt = Templates.forComponent('about');
    return aboutRt.call(this);
  }

}

export default AboutComponent;
