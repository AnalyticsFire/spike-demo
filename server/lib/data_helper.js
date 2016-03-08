import cheerio from 'cheerio';
import fs from 'fs';
import moment from 'moment';

class DataHelper {

  static baseIrradiance(){
    return new Promise((fnResolve, fnReject)=>{
      fs.readFile(__dirname + '/../data/irradiance.html', (err, data)=>{
        if (err) return fnReject(err);
        var $ = cheerio.load(data),
          base_irradiance = {};
        $('tbody tr').each((i, elem)=>{
          if (i === 0) return true;
          var cells = $(elem).find('td'),
            date_s = moment($(cells[1]).text(), 'YYYY-MM-DD').format('MM-DD'),
            irradiance = parseFloat($(cells[2]).text());
          base_irradiance[date_s] = irradiance;
        });
        fnResolve(base_irradiance);
      });
    });
  }

}

export default DataHelper;
