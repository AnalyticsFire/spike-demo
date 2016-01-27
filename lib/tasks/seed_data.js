module.exports = function(done) {

  var csv = require("fast-csv"),
    Database = require("./config/database"),
    Country = require("./models/country"),
    Datum = require("./models/datum"),
    countries = [],
    data = new Map();

  function seedEmissions(fn){
    var i = -1;
    csv
     .fromPath(__dirname + "/data/CAIT/emissions.csv")
     .on("data", (row)=>{
        i += 1;
        if (i == 0) return true;
        var name = row[0],
          year = parseInt(row[1]),
          key = name + year,
          energy = parseFloat(row[11]) || null,
          industrial = parseFloat(row[12]) || null,
          agriculture = parseFloat(row[13]) || null,
          waste = parseFloat(row[14]) || null,
          lucf = parseFloat(row[15]) || null,
          total_emissions = Math.max((energy + industrial + agriculture + waste + lucf), parseFloat(row[3])) || null; // MtCO2eq

        if (countries.indexOf(name) < 0) countries.push(name);
        data.set(key, data.get(key) || {name: name, year: year});
        datum = data.get(key);
        datum.energy_emissions = energy; // MtCO2eq
        datum.industrial_emissions = industrial; // MtCO2eq
        datum.agriculture_emissions = agriculture; // MtCO2eq
        datum.waste_emissions = waste; // MtCO2eq
        datum.lucf_emissions = lucf; // MtCO2eq
        datum.total_emissions = total_emissions; // MtCO2eq
     })
     .on("end", fn);
  }
  function seedSocioEco(fn){
    var i = -1;
    csv
     .fromPath(__dirname + "/data/CAIT/socioeconomic.csv")
     .on("data", (row)=>{
        i += 1;
        if (i == 0) return true;
        var name = row[0],
          year = parseInt(row[1]),
          key = (name + year),
          population = parseInt(row[2]) || null,
          gdp = parseFloat(row[4]) || null, // Million 2005 USD
          energy = parseFloat(row[5]) || null; // ktoe

        if (countries.indexOf(name) < 0) countries.push(name);
        data.set(key, data.get(key) || {name: name, year: year});
        datum = data.get(key);
        datum.population = population; 
        datum.energy = energy; 
        datum.gdp = gdp;
     })
     .on("end", fn);
  }

  Database.sync().then(()=>{
    seedEmissions(()=>{
      seedSocioEco(()=>{

        Country.sql.bulkCreate(countries.map((name)=>{ return {name: name}; }), {validate: true}).catch((errors)=>{
          console.error(`=== Error ===\n${JSON.stringify(errors)}\n`);
        }).then(()=>{
          return Country.sql.findAll();
        }).then((_countries)=>{
          var country_name_to_id  = new Map();
          for (var country of _countries){
            country_name_to_id.set(country.name, country.id);
          }
          for (var datum of data.values()){
            datum.country_id = country_name_to_id.get(datum.name);
            delete datum["name"];
          }

          var bulk_data = Array.from(data.values());
          Datum.sql.bulkCreate(bulk_data, {validate: true}).catch((errors)=>{
            console.error(`=== Error ===\n${JSON.stringify(errors)}\n`);
          }).error((err)=>{
            console.error(`=== Error ===\n${err}`);
          }).then(()=>{
            return Datum.sql.count();
          }).then((count)=>{
            console.log(`Count: ${count} ${bulk_data.length}`)
            if (count === bulk_data.length){
              done();
            } else {
              console.log("Error!");
              done();
            }
          });

        });

      });
    });
  });

};
