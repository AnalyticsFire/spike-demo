import 'babel-polyfill';
import 'bootstrap/dist/js/bootstrap.min';
import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './dashboard/layout/layout.component';

export default function(createHistory){
  ReactDOM.render(
    React.createElement(Layout, {createHistory: createHistory}),
    document.getElementById('root')
  );
};
