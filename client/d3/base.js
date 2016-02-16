import extend from 'extend';

const DEFAULTS = {
  outer_width: 500,
  outer_height: 300,
  margin: {top: 30, left: 70, bottom: 50, right: 20},
  domain_ticks: 10,
  range_ticks: 8,
  container: "container",
  time_series: false,
  range_label: undefined,
  domain_attr: undefined,
  range_attr: undefined,
  titleize: function(series, datum){
    var s = datum ? datum.title : series.title;
    if (!s) return '';
    var words = s.split(' '),
      array = [];
    for (var i=0; i<words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
    }
    return array.join(' ');
  },
  toCssClass: function(series){
    return series ? series.title.toLowerCase().replace(/\s+/g, '-') : "";
  }
};


class Chart {

  constructor(options){
    var chart = this;
    chart = extend(chart, chart.chart_options, options);

    chart.height = chart.outer_height - chart.margin.top - chart.margin.bottom;
    chart.width = chart.outer_width - chart.margin.left - chart.margin.right;

    chart.svg = d3.select(chart.container).append("svg")
        .attr("width", chart.outer_width)
        .attr("height", chart.outer_height)
      .append("g")
        .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");
    chart.defineAxes();
    if (chart.afterAxes) chart.afterAxes();
  }

  defineAxes(){
    var chart = this;

    chart.y_scale = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis = d3.svg.axis()
      .scale(chart.y_scale)
      .orient("left")
      .outerTickSize(1);

    if (chart.time_series){
      chart.x_scale = d3.time.scale()
        .range([0, chart.width]);
    } else {
      chart.x_scale = d3.scale.linear()
        .range([0, chart.width]);
    }

    chart.x_axis = d3.svg.axis()
      .scale(chart.x_scale)
      .orient("bottom")
      .outerTickSize(0)
    //chart.x_axis.tickFormat(d3.time.format('%b %d at %H'))
    //chart.x_axis.ticks(d3.time.hour, 12);

    // append axes
    chart.svg.append("g")
        .attr("class", "d3-chart-range d3-chart-axis");
    chart.svg.append("g")
        .attr("class", "d3-chart-domain d3-chart-axis")
        .attr("transform", "translate(0, " + (chart.height) + ")");
  }

  cssClass(series){
    var chart = this;
    if (!chart.toCssClass) return '';
    return chart.toCssClass(series);
  }

  nestedExtent(a, series_values, domain_attr, range_attr){
    var extent = {
      min_domain: Infinity,
      max_domain: -Infinity,
      min_range: Infinity,
      max_range: -Infinity
    };
    a.forEach((series)=>{
      series[series_values].forEach((value)=>{
        extent.min_domain = Math.min(min_domain, value[domain_attr]);
        extent.max_domain = Math.max(max_domain, value[domain_attr]);
        extent.min_range = Math.min(min_range, value[range_attr]);
        extent.max_range = Math.max(max_range, value[range_attr]);
      });
    });
    returnextent
  }

}

Chart.DEFAULTS = DEFAULTS;

export default Chart;
