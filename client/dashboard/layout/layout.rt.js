import React from 'react';
import _ from 'lodash';
function repeatHouse1(house, houseIndex) {
    return React.createElement('option', {
        'value': house.data.id,
        'key': house.scoped_id
    }, house.data.name);
}
export default function () {
    return React.createElement('div', { 'id': 'layout' }, this.state.requesting_data ? React.createElement('div', { 'className': 'alert alert-warning' }, 'Retrieving houses...') : null, React.createElement('h4', {}, 'Select household:'), this.state.houses ? React.createElement.apply(this, [
        'select',
        {
            'id': 'houses_select',
            'className': 'form-control',
            'onChange': this.setHouse.bind(this),
            'value': this.props.params.house_id
        },
        _.map(this.state.houses, repeatHouse1.bind(this))
    ]) : null, this.state.house ? React.createElement('button', {
        'onClick': this.refreshData.bind(this),
        'className': 'btn btn-xs btn-default'
    }, 'Refresh House Data') : null, '\n\n  ', this.props.children, '\n');
};