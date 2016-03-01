import React from 'react';
import _ from 'lodash';
function repeatEnergy_datum1(energy_datum, energy_datumIndex) {
    return React.createElement('tr', { 'key': energy_datum.scoped_id }, React.createElement('td', {}), React.createElement('td', {}, energy_datum.day_to_s), React.createElement('td', {}, energy_datum.consumption_to_s), React.createElement('td', {}, energy_datum.production_to_s));
}
export default function () {
    return this.context.house ? React.createElement('table', { 'className': 'table' }, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'Day'), React.createElement('th', {}, 'Consumption (kWh)'), React.createElement('th', {}, 'Production (kWh)'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.context.house.energy_data, repeatEnergy_datum1.bind(this))
    ])) : null;
};