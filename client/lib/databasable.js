import Loki from 'lokijs/src/lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';

const DEFAULTS = {
  autosave: false
};

var databasable = {

  accessDb: function(db_name, opts){
    var databasable = this;
    opts = Object.assign(Object.assign({
      adapter: new LokiIndexedAdapter(db_name)
    }, DEFAULTS), opts || {});
    return new Promise((fnResolve, fnReject)=>{
      if (!databasable.db) {
        databasable.db = new Loki(db_name, opts);
        databasable.db.loadDatabase({}, ()=>{
          fnResolve(databasable.db);
        });
      } else { fnResolve(databasable.db); }

    });
  },

  closeDb: function(){
    var databasable = this;
    if (databasable.db){
      databasable.db.save();
      databasable.db.close();
      databasable.db = undefined;
    }
  },

  collection: function(db_name, collection_name, options){
    var databasable = this;
    return databasable.accessDb(db_name)
        .then((db)=>{
          var collection = db.getCollection(collection_name)
          if (!collection){
            collection = db.addCollection(collection_name, options);
            if (options && options.unique_indices){
              options.unique_indices.forEach((field)=>{
                collection.ensureUniqueIndex(field);
              });
            }
          }
          return collection;
        });
  },

  rangeToLokiParams: function(attr, range){
    var date_params = {};
    if (range[0] !== undefined && range[0] !== undefined){
      var start_condition = {},
        end_condition = {};
      date_params['$and'] = [start_condition, end_condition];
      start_condition[attr] = {'$gte': range[0]};
      end_condition[attr] = {'$lte': range[1]};
    } else if (range[0] !== undefined) {
      date_params[attr] = {'$gte': range[0]}
    } else if (range[1] !== undefined) {
      date_params[attr] = {'$lte': range[1]}
    }
    return date_params;
  }

};

export default databasable;
