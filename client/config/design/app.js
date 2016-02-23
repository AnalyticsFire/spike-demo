import Styles from 'config/styles';
import Templates from 'config/templates';
import app from './../../app';

Promise.all([
  Templates.sync(),
  Styles.sync()
]).then(()=>{
  jQuery('#compiling_layouts').remove();
  app();
});
