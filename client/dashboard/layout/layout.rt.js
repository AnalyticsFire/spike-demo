import React from 'react';
import _ from 'lodash';
function repeatView1(view, viewIndex) {
    return React.createElement('option', {
        'value': view[0],
        'key': 'view-' + view[0]
    }, view[1]);
}
function repeatHouse2(house, houseIndex) {
    return React.createElement('option', {
        'value': house.data.id,
        'key': house.react_key
    }, house.data.name);
}
function repeatEnergy_datum3(energy_datum, energy_datumIndex) {
    return React.createElement('tr', { 'key': energy_datum.react_key }, React.createElement('td', {}), React.createElement('td', {}, energy_datum.day_to_s), React.createElement('td', {}, energy_datum.consumption_to_s), React.createElement('td', {}, energy_datum.production_to_s));
}
function repeatPower_datum4(power_datum, power_datumIndex) {
    return React.createElement('tr', { 'key': power_datum.react_key }, React.createElement('td', {}), React.createElement('td', {}, power_datum.time_to_s), React.createElement('td', {}, power_datum.consumption_to_s), React.createElement('td', {}, power_datum.production_to_s));
}
export default function () {
    return React.createElement('div', { 'id': 'layout' }, this.state.requesting_data ? React.createElement('div', { 'className': 'alert alert-warning' }, 'Loading data...') : null, this.state.house ? React.createElement('h1', {}, this.state.house.name) : null, this.state.view ? React.createElement('h3', {}, this.view_name) : null, React.createElement('div', {}, React.createElement.apply(this, [
        'select',
        {
            'className': 'form-control',
            'onChange': this.setView
        },
        _.map(this.state.views, repeatView1.bind(this))
    ])), this.state.houses ? React.createElement('div', {}, React.createElement.apply(this, [
        'select',
        {
            'className': 'form-control',
            'onChange': this.setHouse
        },
        _.map(this.state.houses, repeatHouse2.bind(this))
    ])) : null, this.state.view === 'energy' && this.state.house ? React.createElement('table', { 'className': 'table' }, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'Day'), React.createElement('th', {}, 'Consumption (kWh)'), React.createElement('th', {}, 'Production (kWh)'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.state.house.energy_data, repeatEnergy_datum3.bind(this))
    ])) : null, this.state.view === 'power' && this.state.house ? React.createElement('table', { 'className': 'table' }, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'Time'), React.createElement('th', {}, 'Consumption (W)'), React.createElement('th', {}, 'Production (W)'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.state.house.power_data, repeatPower_datum4.bind(this))
    ])) : null);
};