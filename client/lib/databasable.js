const DEFAULTS = {
  adapter: ''
};

var databasable = {

  accessDb: function(db_name, opts){
    var databasable = this;
    opts = Object.assign(Object.assign({}, DEFAULTS), opts || {});
    return new Promise((fnResolve, fnReject){
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

  collection(collection_name, options){
    var databasable = this;
    databasable.accessDb()
      .then((db)=>{
        var collection = db.getCollection(collection_name)
        if (!collection){
          collection = db.addCollection(collection_name, options);
        }
        return collection;
      });
  }

};

export default databaseable;
