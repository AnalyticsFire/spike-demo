export default class {

  static normal(average){
    return average + this.n6() * average;
  }

  static n6(){
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
  }

  // min_max1 and min_max2 arrays of length two representing mins and maxes of their ranges;
  // returns array of array length two, representing mins and maxes not within min_max2.
  static minusRange(min_max1, min_max2){
    var minus = [];

    // return undefined if min_max1 not provided
    if (!min_max1 || (!min_max1[0] && !min_max2[1])) return undefined;

    if (min_max1[0] >= min_max2[0]){
      if (min_max1[1] > min_max2[1]) minus.push([min_max2[1], min_max1[1]]);
    } else if (min_max1[1] <= min_max2[1]){
      if (min_max1[0] < min_max2[0]) minus.push([min_max1[0], min_max2[0]]);
    } else if (min_max1[0] < min_max2[0] && min_max1[1] > min_max2[1]){
      minus.push([min_max1[0], min_max2[0]]);
      minus.push([min_max2[1], min_max1[1]]);
    } else {
      minus.push([min_max1[0], min_max1[1]]);
    }
    return minus;
  }

  static inRange(n, min_max){
    var min = min_max[0],
      max = min_max[1];
    return ((n >= min) && (n <= max));
  }

}
