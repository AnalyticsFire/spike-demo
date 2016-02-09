import gulp from 'gulp';
import yargs from 'yargs';
import webpack from 'webpack';
import gutil from 'gulp-util';

import DB from './server/config/database';
import {PowerDataSeed, HouseSeed} from './server/lib/tasks/seed_data';
import rtCompile from './server/lib/tasks/react_template_compile';
import rt_config from './server/config/react_templates';

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
        .pipe(rtCompile(rt_config))
        .pipe(gulp.dest('./client/dashboard'));
});


gulp.task('build', function(done) {
  var config, env;

  if (yargs.argv.production){
    env = 'production';
  } else if (yargs.argv.design){
    env = 'design';
  } else {
    throw new gutil.PluginError("webpack", "Must add '--production' or '--design' option.");
  }
  config = require(`${__dirname}/server/config/webpack/${env}`);
  // run webpack
  webpack(config, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        // output options
    }));
    done();
  });

});
