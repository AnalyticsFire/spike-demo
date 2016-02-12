import extend from 'extend';
import Chart from './../base';

// inspired by https://gist.github.com/mbostock/4b66c0d9be9a0d56484e
class CalendarGridChart extends Chart{

  get chart_options(){
    return {
      grid_padding: 1,
      parse_date_format: '%Y-%m-%d',
      display_date_format: '%B %Y',
      date_attr: 'date',
      range_attr: 'z',
      extent: []
    };
  }

  defineAxes(){
    var grid_chart = this;
    grid_chart.y_scale = d3.scale.ordinal()
      .rangeRoundBands([grid_chart.height, 0], 0.05);

    grid_chart.y_axis = d3.svg.axis()
      .scale(grid_chart.y_scale)
      .orient("left");

    grid_chart.x_scale = d3.scale.ordinal()
      .rangeRoundBands([0, grid_chart.width], 0.05);

    grid_chart.x_axis = d3.svg.axis()
      .scale(grid_chart.x_scale)
      .orient("top");

    // append axes
    grid_chart.svg.append("g")
        .attr("class", "d3-chart-domain d3-chart-axis");
    grid_chart.svg.append("g")
        .attr("class", "d3-chart-range d3-chart-axis")
        .attr("transform", "translate(0, " + (grid_chart.height - grid_chart.margin.top) + ")");
  }

  afterAxes(){
    var grid_chart = this;
    grid_chart.day_length = grid_chart.width / 31 - grid_chart.grid_padding * 30;
    if (grid_chart.parse_date_format) grid_chart.parseDate = d3.time.format(grid_chart.parse_date_format);
    if (grid_chart.display_date_format) grid_chart.displayDate = d3.time.format(grid_chart.display_date_format);
    grid_chart.monthFormat = d3.time.format('%B %Y');
  }

  serializeData(data){
    var grid_chart = this,
      serialized_data = {
        series: data
      };
    serialized_data.css_class = data.css_class || bar_chart.toClass ? bar_chart.toClass(data_set) : "";
    serialized_data.title = bar_chart.titleize ? bar_chart.titleize(data_set) : "";

    toDate = grid_chart.parseDate ? (d)=>{ return grid_chart.parseDate(d[grid_chart.date_attr]); } : (d)=>{ return d[grid_chart.date_attr] };

    var min_range = grid_chart.extent[0] || 0,
      max_range = grid_chart.extent[1] || 0;
    serialized_data.months = [];
    series.values.forEach((value)=>{
      var date = toDate(value),
        date_s = grid_chart.monthFormat(value);

      min_range = Math.min(0, min_range, value[grid_chart.range_attr]);
      max_range = Math.max(max_range, value[grid_chart.range_attr]);
      if (serialized_data.months.indexOf(date_s) < 0) serialized_data.months.push(date_s);
    });
    serialized_data.range ={
      min: min_range,
      max: max_range,
      diff: max_range - min_range };

    serialized_data.months = serialized_data.months.sort((date_s1, date_s2)=>{
      var date1 = grid_chart.monthFormat(date_s1),
        date2 = grid_chart.monthFormat(date_s2);
      return date1.toTime() - date2.toTime();
    });
    return serialized_data;
  };

  drawData(data){
    var grid_chart = this;
    data = grid_chart.serializeData(data);

    // calibrate axes
    grid_chart.y_scale.domain(data.months);
    grid_chart.svg.select(".d3-chart-range")
      .call(grid_chart.y_axis);

    grid_chart.x_scale.domain([1, 31]);
    grid_chart.svg.select(".d3-chart-domain").call(grid_chart.x_axis);

    var grid_units = grid_chart.svg.selectAll(".d3-chart-grid-unit" + series.css_class)
        .data(data.series.values);
    grid_chart.applyData(data.series, grid_units.enter().append("rect"));
    grid_chart.applyData(data.series, grid_units.transition());
    grid_units.exit().remove();
  }

  // helper method for drawData.
  applyData(series, elements){
    var grid_chart = this,
        series_class = "d3-chart-grid-unit " + series.css_class;
      elements
          .attr("class", function(d){ return series_class + " " + d.css_class; })
          .attr("y", function(d) { return grid_chart.y_scale(grid_chart.monthFormat(d[grid_chart.date_attr])); })
          .attr("height", grid_chart.y_scale.rangeBand())
          .attr("x", function(d) { return d[grid_chart.date_attr].getDate(); })
          .attr("width", function(d) { return grid_chart.x_scale.rangeBand(); })
          .attr("opacity", function(d) { return grid_chart.applyOpacity(d[grid_chart.range_attr], series.range);  })
  }

  applyOpacity(value, range){
    return (value - range.max) / range.diff;
  };

}

export default CalendarGridChart;
