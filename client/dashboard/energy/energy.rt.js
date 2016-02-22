import React from 'react';
import _ from 'lodash';
function repeatEnergy_datum1(energy_datum, energy_datumIndex) {
    return React.createElement('tr', { 'key': energy_datum.scoped_id }, React.createElement('td', {}), React.createElement('td', {}, energy_datum.day_to_s), React.createElement('td', {}, energy_datum.consumption_to_s), React.createElement('td', {}, energy_datum.production_to_s));
}
export default function () {
    return React.createElement('div', { 'id': 'energy_view' }, this.state.loading_data ? React.createElement('div', { 'className': 'alert alert-warning' }, '\n    Retrieving energy data for the ', this.props.house.name, ' household...\n  ') : null, this.props.view === 'graph' ? React.createElement('div', {}, React.createElement('h4', {}, 'Select Data'), React.createElement('div', {
        'className': 'btn-group',
        'role': 'group'
    }, React.createElement('button', {
        'data-value': 'consumption',
        'className': _.keys(_.pick({ active: this.state.graph_attr === 'consumption' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setGraphAttr,
        'type': 'button'
    }, 'Consumption'), React.createElement('button', {
        'data-value': 'production',
        'className': _.keys(_.pick({ active: this.state.graph_attr === 'production' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setGraphAttr,
        'type': 'button'
    }, 'Production'))) : null, this.props.view === 'table' ? React.createElement('table', { 'className': 'table' }, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'Day'), React.createElement('th', {}, 'Consumption (kWh)'), React.createElement('th', {}, 'Production (kWh)'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.props.house.energy_data, repeatEnergy_datum1.bind(this))
    ])) : null, this.props.view === 'graph' ? React.createElement('div', { 'id': 'energy_graph' }) : null);
};