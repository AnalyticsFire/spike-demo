import 'babel-polyfill';
import 'bootstrap/dist/js/bootstrap.min';

import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './dashboard/layout/layout';

ReactDOM.render(
  React.createElement(Layout),
  document.getElementById('root')
);
