import fs from 'fs';
import path from 'path';

class FsHelper {

  // http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
  static walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            FsHelper.walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  }

}

export default FsHelper;
