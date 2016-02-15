import React from 'react';
import _ from 'lodash';
import Energy from './../energy/energy';
import Power from './../power/power';
function repeatHouse1(house, houseIndex) {
    return React.createElement('option', {
        'value': house.data.id,
        'key': house.react_key
    }, house.data.name);
}
export default function () {
    return React.createElement('div', { 'id': 'layout' }, this.state.requesting_data ? React.createElement('div', { 'className': 'alert alert-warning' }, 'Retrieving houses...') : null, this.state.house ? React.createElement('h1', {}, this.state.house.name) : null, React.createElement('h4', {}, 'Select household:'), this.state.houses ? React.createElement.apply(this, [
        'select',
        {
            'className': 'form-control',
            'onChange': this.setHouse
        },
        _.map(this.state.houses, repeatHouse1.bind(this))
    ]) : null, React.createElement('h4', {}, 'Select dataset:'), React.createElement('div', {
        'className': 'btn-group',
        'role': 'group'
    }, React.createElement('button', {
        'data-value': 'energy',
        'className': _.keys(_.pick({ active: this.state.dataset === 'energy' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setDataset,
        'type': 'button'
    }, 'Daily Energy Statistics'), React.createElement('button', {
        'data-value': 'power',
        'className': _.keys(_.pick({ active: this.state.dataset === 'power' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setDataset,
        'type': 'button'
    }, '15-minute Power Statistics')), React.createElement('h4', {}, 'View as:'), React.createElement('div', {
        'className': 'btn-group',
        'role': 'group'
    }, React.createElement('button', {
        'data-value': 'graph',
        'className': _.keys(_.pick({ active: this.state.view === 'graph' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setView,
        'type': 'button'
    }, 'Graph'), React.createElement('button', {
        'data-value': 'table',
        'className': _.keys(_.pick({ active: this.state.view === 'table' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setView,
        'type': 'button'
    }, 'Table')), this.state.house && this.state.dataset === 'energy' ? React.createElement(Energy, {
        'house': this.state.house,
        'view': this.state.view
    }) : null, this.state.house && this.state.dataset === 'power' ? React.createElement(Power, {
        'house': this.state.house,
        'view': this.state.view
    }) : null);
};