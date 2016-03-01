import React from 'react';
import _ from 'lodash';
export default function () {
    return React.createElement('div', { 'id': 'energy_view' }, this.state.loading_energy_data ? React.createElement('div', { 'className': 'alert alert-warning' }, '\n    Retrieving energy data...\n  ') : null, this.props.view === 'graph' ? React.createElement('div', {}, React.createElement('h4', {}, 'Select Data'), React.createElement('div', {
        'className': 'btn-group',
        'role': 'group'
    }, React.createElement('button', {
        'data-param': 'graph_attr',
        'data-value': 'consumption',
        'className': _.keys(_.pick({ active: this.state.graph_attr === 'consumption' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setAttr,
        'type': 'button'
    }, 'Consumption'), React.createElement('button', {
        'data-param': 'graph_attr',
        'data-value': 'production',
        'className': _.keys(_.pick({ active: this.state.graph_attr === 'production' }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setGraphAttr,
        'type': 'button'
    }, 'Production'))) : null, '\n  ', this.props.children, '\n');
};