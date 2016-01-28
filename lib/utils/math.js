export default class {
  
  static normal(average){
    return average + n6() * average;
  }

  static n6(){
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
  }
}
