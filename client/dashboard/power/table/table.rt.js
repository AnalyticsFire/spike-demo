import React from 'react';
import _ from 'lodash';
function repeatPower_datum1(power_datum, power_datumIndex) {
    return React.createElement('tr', { 'key': power_datum.scoped_id }, React.createElement('td', {}), React.createElement('td', {}, power_datum.time_to_s), React.createElement('td', {}, power_datum.consumption_to_s), React.createElement('td', {}, power_datum.production_to_s));
}
export default function () {
    return this.context.house ? React.createElement('table', { 'className': 'table' }, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'Time'), React.createElement('th', {}, 'Consumption (W)'), React.createElement('th', {}, 'Production (W)'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.context.house.power_data, repeatPower_datum1.bind(this))
    ])) : null;
};