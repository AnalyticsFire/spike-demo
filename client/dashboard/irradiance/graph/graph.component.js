import React from 'react';
import Templates from 'config/templates';
import c3 from 'c3';

class GraphComponent extends React.Component {

  constructor(props){
    super(props);
  }

  get state_manager(){
    return this.props.state_manager;
  }

  get houses(){
    return this.state_manager.houses;
  }

  get chart_data(){
    var irradiance_graph = this;
    return Object.keys(irradiance_graph.state_manager.irradiance_data).map((day)=>{
      var day_data = irradiance_graph.state_manager.irradiance_data[day],
        day_datum = {date: day};
      day_data.forEach((energy_datum)=>{
        day_datum['irradiance'+energy_datum.house.data.id] = energy_datum.irradiance;
        day_datum['production'+energy_datum.house.data.id] = energy_datum.production;
      });
      return day_datum;
    }).filter((day_datum)=>{
      // due to timezone offsets, some houses might not have an energy_datum point,
      // where others do. Just filter those dates out to avoid UI confusion.
      return Object.keys(day_datum).length === irradiance_graph.value_keys.length;
    });
  }

  get value_keys(){
    var irradiance_graph = this;
    return ['date'].concat(Object.keys(irradiance_graph.names));
  }

  get irradiance_keys(){
    return this.houses.map((house)=>{
      return 'irradiance' + house.data.id;
    });
  }

  get production_keys(){
    return this.houses.map((house)=>{
      return 'production' + house.data.id;
    });
  }

  get colors(){
    var fnColor = d3.scale.category20(),
      irradiance_graph = this;
    return Object.keys(irradiance_graph.names).reduce((colors, key)=>{
      colors[key] = fnColor(key);
      return colors;
    }, {});
  }

  get names(){
    var names = {};
    this.houses.forEach((house)=>{
      names['irradiance' + house.data.id] = house.data.name + ' Irradiance';
      names['production' + house.data.id] = house.data.name + ' Production';
    });
    return names;
  }

  get axes(){
    var irradiance_graph = this,
      axes = {};
    irradiance_graph.production_keys.forEach((production_key)=>{
      axes[production_key] = 'y';
    });
    irradiance_graph.irradiance_keys.forEach((irradiance_key)=>{
      axes[irradiance_key] = 'y2';
    });
    return axes;
  }

  get types(){
    var irradiance_graph = this;
    return irradiance_graph.production_keys.reduce((types, production_key)=>{
      types[production_key] = 'bar';
      return types;
    }, {});
  }

  componentDidMount(){
    var irradiance_graph = this;
    irradiance_graph.updateGraph();
  }

  componentDidUpdate(prev_props, prev_state){
    var irradiance_graph = this;
    if (irradiance_graph.props.date_interval[0] != prev_props.date_interval[0] ||
          irradiance_graph.props.date_interval[1] != prev_props.date_interval[1]){
      irradiance_graph.updateGraph();
    }
  }

  updateGraph(){
    var irradiance_graph = this,
      data = {
        json: irradiance_graph.chart_data,
        keys: {
          x: 'date', // it's possible to specify 'x' when category axis
          value: irradiance_graph.value_keys,
        },
        types: irradiance_graph.types,
        names: irradiance_graph.names,
        groups: [irradiance_graph.production_keys],
        axes: irradiance_graph.axes,
        colors: irradiance_graph.colors
      };
    if (!irradiance_graph.chart){
      irradiance_graph.chart = c3.generate({
        bindto: '#irradiance_graph',
        data: data,
        axis: {
          x: {
            type: 'timeseries',
            tick: { format: d3.time.format('%d %B %y') }
          },
          y: {
            label: 'Production'
          },
          y2: {
            show: true,
            label: 'Irradiance'
          }
        }
      });
    } else {
      console.log('reloading data')
      console.log(data)
      data.unload = irradiance_graph.chart.data;
      irradiance_graph.chart.load(data);
    }
  }

  render() {
    var irradianceGraphRt = Templates.forComponent('irradiance_graph');
    return irradianceGraphRt.call(this);
  }
}
GraphComponent.NAME = 'IrradianceGraph';

module.exports = GraphComponent;

