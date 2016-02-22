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
    return extent;
  }

  titleize(s){
    var words = s.split(' '),
      array = [];
    for (var i=0; i<words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
    }
    return array.join(' ');
  }

}

Chart.DEFAULTS = DEFAULTS;

export default Chart;
