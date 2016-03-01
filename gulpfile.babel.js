import gulp from 'gulp';
import yargs from 'yargs';
import webpack from 'webpack';
import gutil from 'gulp-util';

import FsHelper from './server/lib/fs_helper';
import ComponentMapWriter from './server/lib/tasks/component_map_writer';
import DB from './server/config/database';
import {PowerDataSeed, HouseSeed} from './server/lib/tasks/seed_data';

gulp.task('generate_power_csv', function(done){
  DB.sync().then(()=>{
    PowerDataSeed.generateCsv(yargs.argv, done);
  });
});

gulp.task('save_power_csv', function(done){
  DB.sync().then(()=>{
    PowerDataSeed.saveCsv(yargs.argv, done);
  });
});

gulp.task('save_house_csv', function(done){
  DB.sync().then(()=>{
    HouseSeed.saveCsv(yargs.argv, done);
  });
});

// right now, build only available for design.
gulp.task('build', function(done) {
  var config, env,
    gulpCopy = require('gulp-copy');

  if (yargs.argv.design){
    process.env.NODE_ENV = 'design';
  } else {
    throw new gutil.PluginError("webpack", "Must include '--design' option.");
  }

  // write template map.
  ComponentMapWriter.write(__dirname + '/client/config/design/component_map.js')
    .then(()=>{

      // build assets/app.js and assets/style.css
      config = require(`${__dirname}/client/config/${process.env.NODE_ENV}/webpack.js`);
      webpack(config, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({}));

        if (yargs.argv.design){
          // copy all react templates and their styles sheets into build/design/dashboard.
         gulp.src([
            `client/app.scss`
          ]).pipe(gulpCopy(`client/build/design/dashboard`, {prefix: 1}));

          FsHelper.walk('client/dashboard', (err, files)=>{
            var files_to_copy = files.filter((file)=>{
              return /\.(rt|scss)$/.test(file)
            });
            gulp.src(files_to_copy)
              .pipe(gulpCopy('client/build/design/dashboard', {prefix: 2}));
            done()
          });
        }

      });

    });
});
