import gulp from 'gulp';
import yargs from 'yargs';
import webpack from 'webpack';
import gutil from 'gulp-util';
import gulpCopy from 'gulp-copy';
import fs from 'fs';

import FsHelper from './server/lib/fs_helper';
import ComponentMapWriter from './server/lib/tasks/component_map_writer';
import DesignDataGenerator from './server/lib/tasks/design_data_generator';
import BuildDashboardAssets from './server/lib/tasks/build_dashboard_assets';
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

gulp.task('generate_design_data', function(){
  var house_ids = yargs.argv.house_ids.split(','),
    start_date = parseInt(yargs.argv.start_date),
    end_date = parseInt(yargs.argv.end_date),
    data_generator = new DesignDataGenerator(house_ids, [start_date, end_date]);
  return DB.sync()
          .then(()=>{ return data_generator.exec(); });
});

// right now, build only available for design.
gulp.task('build', function(done) {
  var config, env;

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
          var path = 'client/build/design/dashboard';
          // copy all react templates and their styles sheets into build/design/dashboard.
          FsHelper.rmdirAsync(path, ()=>{
            fs.mkdir(path, ()=>{
              gulp.src([
                `client/app.scss`
              ]).pipe(gulpCopy(path, {prefix: 1}));

              FsHelper.walk('client/dashboard', (err, files)=>{
                if (err){ console.log(err); done(); return false; }
                var files_to_copy = files.filter((file)=>{
                  return /\.(rt|scss)$/.test(file)
                });
                gulp.src(files_to_copy)
                  .pipe(gulpCopy(path, {prefix: 2}));
                done()
              });
            })
          });
        }

      });

    });
});
