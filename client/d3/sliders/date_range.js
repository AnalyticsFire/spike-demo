import Chart from './../base';

class DateRange extends Chart {


  get chart_options(){
    return Object.assign(Object.assign({}, Chart.DEFAULTS), {
      outer_width: 600,
      outer_height: 250,
      margin: {top: 20, left: 10, bottom: 20, right: 10},
    });
  }

  defineAxes(){
    var date_range = this;

    date_range.x_scale = d3.time.scale()
      .range([0, date_range.width])
      .clamp(true);

    date_range.x_axis = d3.svg.axis()
      .scale(date_range.x_scale)
      .orient("bottom")
      .ticks(d3.time.weeks, 1)
      //.tickFormat(function(d) { return d + "°"; })
      .tickSize(1)
      .outerTickSize(1)
      .tickPadding(12)

    date_range.svg.append("g")
        .attr("class", "d3-chart-domain")
        .attr("transform", "translate(0," + date_range.height / 2 + ")");
  }

  afterAxes(){
    var date_range = this;

    date_range.slider = date_range.svg.append("g")
        .attr("class", "d3-chart-slider");

    date_range.min_handle = date_range.slider.append("circle")
      .attr("class", "d3-chart-min-handle")
      .attr("transform", "translate(0," + date_range.height / 2 + ")")
      .attr("r", 9);

    date_range.max_handle = date_range.slider.append("circle")
      .attr("class", "d3-chart-max-handle")
      .attr("transform", "translate(0," + date_range.height / 2 + ")")
      .attr("r", 9);

    date_range.brush = d3.svg.brush()
      .x(date_range.x_scale);

    date_range.slider
      .call(date_range.brush)
      //.select(".background")
      //  .attr("height", date_range.height);

    date_range.slider.call(date_range.brush)
      .selectAll(".extent,.resize")
      .remove();
  }

  drawData(data){
    var date_range = this;
    date_range.x_scale.domain([data.abs_min, data.abs_max]);

    date_range.svg.select(".d3-chart-domain")
      .call(date_range.x_axis);

    date_range.min_handle.attr('cx', date_range.x_scale(data.current_min));
    date_range.max_handle.attr('cx', date_range.x_scale(data.current_max));

    date_range.brush.extent([data.current_min, data.current_min])
      .on("brush", ()=>{
        DateRange.handleBrush(date_range, eval('this'));
      });

    date_range.slider
        .call(date_range.brush.event)
      .transition() // gratuitous intro!
        .duration(750)
        .call(date_range.brush.extent([data.current_min, data.current_min]))
        .call(date_range.brush.event);

  }

  static handleBrush(date_range, elem){
    var date = date_range.brush.extent()[0],
      current_min = parseInt(date_range.min_handle.attr('cx')),
      current_max = parseInt(date_range.max_handle.attr('cx'));

    if (!current_min && !current_max) return false
    if (d3.event.sourceEvent) { // not a programmatic event
      date = date_range.x_scale.invert(d3.mouse(elem)[0]);
      date_range.brush.extent([date, date]);
    }

    var value = date_range.x_scale(date);

    if (value < current_max && value > current_min){
      if (Math.abs(value - current_min) < Math.abs(value - current_max)){
        date_range.min_handle.attr('cx', value);
        current_min = value;
      } else {
        date_range.max_handle.attr('cx', value);
        current_max = value;
      }
    } else if (value >= current_max){
      date_range.max_handle.attr('cx', value);
      current_max = value;
      if (d3.event.sourceEvent && date_range.maxDelta){
        var new_current_min = date_range.maxDelta(date, date_range.x_scale.invert(current_min));
        if (new_current_min) date_range.min_handle.attr('cx', date_range.x_scale(new_current_min));
      }
    } else {
      date_range.min_handle.attr('cx', value);
      current_min = value;
      if (d3.event.sourceEvent && date_range.maxDelta){
        var new_current_max = date_range.maxDelta(date, date_range.x_scale.invert(current_max));
        if (new_current_max) date_range.max_handle.attr('cx', date_range.x_scale(new_current_max));
      }
    }


    if (d3.event.sourceEvent && date_range.onRangeUpdated) {
      date_range.onRangeUpdated(date_range.x_scale.invert(current_min), date_range.x_scale.invert(current_max));
    }
  }

}

export default DateRange;
