import Loki from 'lokijs/src/lokijs';

import Databasable from './../../../client/lib/databasable';

class DbClass {
  constructor(){
    Object.assign(this, Databasable);
  }

  get lokijs_options(){
    return {
      adapter: null
    };
  }

  doSomethingWithCollection(){
    var db_class = this;
    return db_class.collection('yadadb', 'yada_collection')
      .then((collection)=>{
        db_class.collection = collection;
      })
      .then(()=>{
        db_class.worked = db_class.collection instanceof Loki.Collection;
      });
  }

}

var db_class;

describe('Databasable', ()=>{
  beforeEach(()=>{
    db_class = new DbClass();
  });

  describe('Databasable#accessDb', ()=>{
    it('should initiate a new database', (done)=>{
      db_class.accessDb('yadadb')
        .then(()=>{
          expect(db_class.db instanceof Loki).toEqual(true);
          done();
        });
    });
  });

  describe('Databasable#collection', ()=>{
    it('should initiate a new database & collection', (done)=>{
      db_class.collection('yadadb', 'yada_collection')
        .then((collection)=>{
          expect(db_class.db instanceof Loki).toEqual(true);
          expect(collection instanceof Loki.Collection).toEqual(true);
          done();
        });
    });
    it('works asynchronously', (done)=>{
      db_class.doSomethingWithCollection()
        .then(()=>{
          expect(db_class.collection instanceof Loki.Collection).toEqual(true);
          expect(db_class.worked).toEqual(true);
          done();
        })
    });
  });

});
