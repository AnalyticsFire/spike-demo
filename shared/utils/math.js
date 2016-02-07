export default class {

  static normal(average){
    return average + this.n6() * average;
  }

  static n6(){
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
  }
}
