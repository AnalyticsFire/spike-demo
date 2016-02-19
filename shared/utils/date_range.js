class DateRange {

  static addRange(new_range, ranges){
    var gaps_filled = [], new_ranges = [],
      start = new_range[0], end = new_range[1];
    if (start === undefined && end === undefined && ranges.length === 0){
      gaps_filled = [undefined, undefined];
      new_ranges = [[undefined, undefined]];
    } else if (ranges.length === 0){
      gaps_filled = [new_range];
      new_ranges = [new_range]
    } else {
      var covered = false,
        last_start = start,
        last_end = start;

      ranges.forEach((range, i)=>{
        if (covered){ new_ranges.push(range); return true; }
        if (DateUtil.lte(start, range[0])){
          if (end && !DateUtil.eq(end, range[0]) && DateUtil.lte(end, range[0])){
            new_ranges.push([last_start, end]);
            new_ranges.push(range);
            gaps_filled.push([last_end, end]);
            covered = true;
          } else if (end && !DateUtil.gte(end, range[1])) {
            new_ranges.push([last_start, range[1]]);
            if (range[0] && !DateUtil.eq(last_end, range[0])){ gaps_filled.push([last_end, range[0]]); }
            covered = true
          } else {
            if (range[0] && !DateUtil.eq(last_end, range[0])) gaps_filled.push([last_end, range[0]]);
            last_end = range[1]
          }
        } else if (start && DateUtil.gte(range[1], start)){
            if (!DateUtil.eq(end, range[1]) && DateUtil.gte(end, range[1])){
              last_start = range[0];
              last_end = range[1];
            } else {
              new_ranges.push(range);
              covered = true;
            }
        } else { new_ranges.push(range); }
      });
      if (!covered) {
        new_ranges.push([last_start, end]);
        if (!DateUtil.eq(last_end, end)) gaps_filled.push([last_end, end]);
      }
    }

    return { gaps_filled: gaps_filled, new_ranges: new_ranges }
  }

  static gte(date1, date2){
    return (date1 === undefined || (date2 !== undefined && date1 >= date2));
  }

  static lte(date1, date2){
    return (date1 === undefined || (date2 !== undefined && date1 <= date2));
  }

  static eq(date1, date2){
    return (date1 !== undefined && date2 !== undefined && date1.getTime() === date2.getTime()) || date1 === undefined && date2 === undefined
  }

  static add(date, s){
    return new Date(date.getTime() + s);
  }

}
export default DateUtil;
