import 'babel-polyfill';
import 'bootstrap/dist/js/bootstrap.min';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';

import {ROUTES} from './dashboard/routes';

export default function(history){
  ReactDOM.render(
    React.createElement(Router, {routes: ROUTES, history: history}),
    document.getElementById('root')
  );
};
