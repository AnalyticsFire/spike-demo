import gulp from 'gulp';
import yargs from 'yargs';

import DB from './config/database';
import {PowerDataSeed, HouseSeed, UserSeed} from './lib/tasks/seed_data';
import updateSchema from './lib/tasks/update_schema';

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

gulp.task('save_user_csv', function(done){
  DB.sync().then(()=>{
    UserSeed.saveCsv(yargs.argv, done);
  });
});
