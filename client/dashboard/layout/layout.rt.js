import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', { 'id': 'layout' }, React.createElement('h1', {}, this.state.view), React.createElement('select', { 'onChange': this.setView }, React.createElement('option', { 'value': 'savings' }, 'Savings'), React.createElement('option', { 'value': 'production' }, 'Production')));
};