import React from 'react';
import _ from 'lodash';
function repeatPower_datum1(power_datum, power_datumIndex) {
    return React.createElement('tr', { 'key': power_datum.react_key }, React.createElement('td', {}), React.createElement('td', {}, power_datum.time_to_s), React.createElement('td', {}, power_datum.consumption_to_s), React.createElement('td', {}, power_datum.production_to_s));
}
export default function () {
    return React.createElement('div', { 'id': 'power_view' }, React.createElement('h2', {}, 'Household 15-minute Power Statistics'), this.state.loading_data ? React.createElement('div', { 'className': 'alert alert-warning' }, '\n    Retrieving power data for the ', this.props.house.name, ' household...\n  ') : null, React.createElement('table', {}, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'Time'), React.createElement('th', {}, 'Consumption (W)'), React.createElement('th', {}, 'Production (W)'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.state.house.power_data, repeatPower_datum1.bind(this))
    ])), React.createElement('div', { 'id': 'power_data' }));
};