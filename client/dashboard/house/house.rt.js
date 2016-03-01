import React from 'react';
import _ from 'lodash';
function repeatYear1(year, yearIndex) {
    return React.createElement('button', {
        'data-param': 'year',
        'data-value': year,
        'key': 'data-year-' + year,
        'className': 'btn-info btn btn-sm' + ' ' + _.keys(_.pick({ active: year == this.context.house.state.year }, _.identity)).join(' '),
        'onClick': this.setParam.bind(this)
    }, year);
}
export default function () {
    return React.createElement('div', { 'id': 'house' }, React.createElement('h4', {}, 'Select dataset:'), React.createElement('div', {
        'className': 'btn-group',
        'role': 'group'
    }, React.createElement('button', {
        'data-param': 'dataset',
        'data-value': 'energy',
        'className': _.keys(_.pick({ active: this.energySelected() }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setParam.bind(this),
        'type': 'button'
    }, 'Daily Energy Statistics'), React.createElement('button', {
        'data-param': 'dataset',
        'data-value': 'power',
        'className': _.keys(_.pick({ active: this.powerSelected() }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setParam.bind(this),
        'type': 'button'
    }, '15-minute Power Statistics')), React.createElement('h4', {}, 'View as:'), React.createElement('div', {
        'className': 'btn-group',
        'role': 'group'
    }, React.createElement('button', {
        'data-param': 'view',
        'data-value': 'graph',
        'className': _.keys(_.pick({ active: this.graphSelected() }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setParam.bind(this),
        'type': 'button'
    }, 'Graph'), React.createElement('button', {
        'data-param': 'view',
        'data-value': 'table',
        'className': _.keys(_.pick({ active: this.tableSelected() }, _.identity)).join(' ') + ' ' + 'btn btn-primary',
        'onClick': this.setParam.bind(this),
        'type': 'button'
    }, 'Table')), this.context.house ? React.createElement('div', {}, React.createElement('h4', {}, 'Select dates:'), React.createElement.apply(this, [
        'div',
        { 'className': 'btn-group' },
        _.map(this.context.house.years, repeatYear1.bind(this))
    ])) : null, React.createElement('br', {}), '\n\n  ', this.props.children, '\n');
};