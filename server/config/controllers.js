import fs from 'fs';

const CONTROLLER_DIR = __dirname + '/../controllers';

class Controllers {

  static sync(){
    fs.readdirSync(CONTROLLER_DIR).forEach(function(file) {
      var controller = require(CONTROLLER_DIR + '/' + file);
      Controllers[controller.NAME] = controller;
    });
    return true;
  }

}

export default Controllers;
