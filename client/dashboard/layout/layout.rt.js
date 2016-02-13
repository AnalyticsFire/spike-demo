import React from 'react';
import _ from 'lodash';
import Energy from './../energy/energy';
import Power from './../power/power';
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
export default function () {
    return React.createElement('div', { 'id': 'layout' }, this.state.requesting_data ? React.createElement('div', { 'className': 'alert alert-warning' }, 'Retrieving houses...') : null, this.state.house ? React.createElement('h1', {}, this.state.house.name) : null, this.state.view ? React.createElement('h3', {}, this.view_name) : null, React.createElement.apply(this, [
        'select',
        {
            'className': 'form-control',
            'onChange': this.setView
        },
        _.map(this.state.views, repeatView1.bind(this))
    ]), this.state.houses ? React.createElement.apply(this, [
        'select',
        {
            'className': 'form-control',
            'onChange': this.setHouse
        },
        _.map(this.state.houses, repeatHouse2.bind(this))
    ]) : null, this.state.house && this.state.view === 'energy' ? React.createElement(Energy, { 'house': this.state.house }) : null);
};