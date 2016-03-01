import React from 'react';
import _ from 'lodash';
function repeatMonth1(month, monthIndex) {
    return React.createElement('button', {
        'data-param': 'month',
        'data-value': month,
        'key': 'data-month-' + month,
        'className': 'btn-warning btn btn-sm' + ' ' + _.keys(_.pick({ active: month === this.context.house.state.month }, _.identity)).join(' '),
        'onClick': this.setParam.bind(this)
    }, month);
}
export default function () {
    return React.createElement('div', { 'id': 'power_view' }, React.createElement.apply(this, [
        'div',
        { 'className': 'btn-group' },
        this.context.house ? _.map(this.context.house.availableMonths(), repeatMonth1.bind(this)) : null
    ]), this.state.loading_power_data ? React.createElement('div', { 'className': 'alert alert-warning' }, '\n    Retrieving power data...\n  ') : null, React.createElement('div', { 'id': 'power_date_setter' }), '\n  ', this.props.children, '\n');
};