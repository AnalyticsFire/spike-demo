#!/usr/bin/env babel-node --optional es7.asyncFunctions

import fs from 'fs';
import path from 'path';
import schema from '../config/graphql/schema';
import { graphql, GraphQLSchema }  from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import DB from './../config/database';

DB.sync().then(()=>{

  var Schema = schema();

  // Save JSON of full schema introspection for Babel Relay Plugin to use
  (async () => {
    var result = await (graphql(Schema, introspectionQuery));
    if (result.errors) {
      console.error(
        'ERROR introspecting schema: ',
        JSON.stringify(result.errors, null, 2)
      );
    } else {
      fs.writeFileSync(
        path.join(__dirname, '../config/graphql/schema.json'),
        JSON.stringify(result, null, 2)
      );
    }
  })();

  // Save user readable type system shorthand of schema
  fs.writeFileSync(
    path.join(__dirname, '../config/graphql/schema.graphql'),
    printSchema(Schema)
  );

});
