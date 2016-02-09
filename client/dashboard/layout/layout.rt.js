import React from 'react/addons';
import _ from 'lodash';
export default function () {
    return React.createElement('div', {}, React.createElement('select', { 'onChange': this.setView }, React.createElement('option', { 'value': 'savings' }, 'Savings'), React.createElement('option', { 'value': 'production' }, 'Production')));
};