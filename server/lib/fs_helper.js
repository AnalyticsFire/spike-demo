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

  static rmdirAsync(path, callback) {
    fs.readdir(path, function(err, files) {
      if(err) {
        // Pass the error on to callback
        callback(err, []);
        return;
      }
      var wait = files.length,
        count = 0,
        folderDone = function(err) {
        count++;
        // If we cleaned out all the files, continue
        if( count >= wait || err) {
          fs.rmdir(path,callback);
        }
      };
      // Empty directory to bail early
      if(!wait) {
        folderDone();
        return;
      }

      // Remove one or more trailing slash to keep from doubling up
      path = path.replace(/\/+$/,"");
      files.forEach(function(file) {
        var curPath = path + "/" + file;
        fs.lstat(curPath, function(err, stats) {
          if( err ) {
            callback(err, []);
            return;
          }
          if( stats.isDirectory() ) {
            FsHelper.rmdirAsync(curPath, folderDone);
          } else {
            fs.unlink(curPath, folderDone);
          }
        });
      });
    });
  }

}

export default FsHelper;
