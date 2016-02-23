import React from 'react';
import _ from 'lodash';
function repeatMonth1(month, monthIndex) {
    return React.createElement('button', {
        'data-value': month,
        'key': 'data-month-' + month,
        'className': 'btn-warning btn btn-sm' + ' ' + _.keys(_.pick({ active: month === this.props.house.current_month }, _.identity)).join(' '),
        'onClick': this.setMonth
    }, month);
}
function repeatPower_datum2(power_datum, power_datumIndex) {
    return React.createElement('tr', {
        'className': 'fuck-you',
        'key': power_datum.scoped_id
    }, React.createElement('td', {}, power_datum.data.id), React.createElement('td', {}, power_datum.time_to_s), React.createElement('td', {}, power_datum.consumption_to_s), React.createElement('td', {}, power_datum.production_to_s));
}
export default function () {
    return React.createElement('div', { 'id': 'power_view' }, React.createElement.apply(this, [
        'div',
        { 'className': 'btn-group' },
        this.props.house ? _.map(this.props.house.availableMonths(), repeatMonth1.bind(this)) : null
    ]), this.state.loading_data ? React.createElement('div', { 'className': 'alert alert-warning' }, '\n    Retrieving power data for the ', this.props.house.name, ' household...\n  ') : null, React.createElement('div', { 'id': 'power_date_setter' }), this.props.view === 'table' ? React.createElement('table', { 'className': 'table' }, React.createElement('thead', {}, React.createElement('tr', {}, React.createElement('th', {}), React.createElement('th', {}, 'Time'), React.createElement('th', {}, 'Consumption (W)'), React.createElement('th', {}, 'Production (W)'))), React.createElement.apply(this, [
        'tbody',
        {},
        _.map(this.props.house.power_data, repeatPower_datum2.bind(this))
    ])) : null, this.props.view === 'graph' ? React.createElement('div', { 'id': 'power_graph' }) : null);
};