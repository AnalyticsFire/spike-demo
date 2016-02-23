import gulp from 'gulp';
import yargs from 'yargs';
import webpack from 'webpack';
import gutil from 'gulp-util';

import DB from './server/config/database';
import {PowerDataSeed, HouseSeed} from './server/lib/tasks/seed_data';
import rtCompile from './server/lib/tasks/react_template_compile';

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

gulp.task('compile_react_templates', function() {
    gulp.src('./client/dashboard/**/*.rt')
        .pipe(rtCompile({
          modules: 'es6',
          targetVersion: '0.14.0',
          suffix: '.rt'
        }))
        .pipe(gulp.dest('./client/dashboard'));
});

// right now, build only available for design.
gulp.task('build', function(done) {
  var config, env;

  if (yargs.argv.design){
    process.env.NODE_ENV = process.env.NODE_ENV || 'design';
  } else {
    throw new gutil.PluginError("webpack", "Must include '--production' or '--design' option.");
  }
  config = require(`${__dirname}/client/config/webpack.js`);
  // run webpack
  webpack(config, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        // output options
    }));
    done();
  });
});
