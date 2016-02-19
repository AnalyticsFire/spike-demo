"use strict";

import DateRange from './../../../shared/utils/date_range.js';

describe('DateRange.gte', ()=>{

  it('considers undefined as a large date', ()=>{
    var date1 = new Date(),
      date2 = new Date(date1.getTime() + 1000);
    expect(DateRange.gte(undefined, date1)).toEqual(true);
    expect(DateRange.gte(undefined, undefined)).toEqual(true);
    expect(DateRange.gte(date1, undefined)).toEqual(false);
    expect(DateRange.gte(date1, date2)).toEqual(false);
    expect(DateRange.gte(date2, date1)).toEqual(true);
  });
});


describe('DateRange.lte', ()=>{
  it('considers undefined as a small date', ()=>{
    var date1 = new Date(),
      date2 = new Date(date1.getTime() + 1000);
    expect(DateRange.lte(undefined, date1)).toEqual(true);
    expect(DateRange.lte(undefined, undefined)).toEqual(true);
    expect(DateRange.lte(date1, undefined)).toEqual(false);
    expect(DateRange.lte(date1, date2)).toEqual(true);
    expect(DateRange.lte(date2, date1)).toEqual(false);
  });
});

describe('DateRange.addRange', ()=>{
  var date1 = new Date(),
    date01 = DateRange.add(date1, -1000),
    date11 = DateRange.add(date1, 1000),
    date2 = DateRange.add(date1, 2000),
    date21 = DateRange.add(date2, 1000),
    date3 = DateRange.add(date2, 2000),
    date31 = DateRange.add(date3, 1000),
    date4 = DateRange.add(date3, 2000),
    date41 = DateRange.add(date4, 1000),
    date5 = DateRange.add(date4, 2000),
    date51 = DateRange.add(date5, 1000),
    date6 = DateRange.add(date5, 2000),
    date61 = DateRange.add(date6, 1000),
    date7 = DateRange.add(date6, 2000),
    date71 = DateRange.add(date7, 1000);

  describe('no ranges exist', ()=>{
    it('returns the new ranges', ()=>{
      var result = DateRange.addRange([date1, date2], []);
      expect(result.gaps_filled).toEqual([[date1, date2]]);
      expect(result.new_ranges).toEqual([[date1, date2]]);
    });
  });

  describe('infinite range exists', ()=>{
    it('returns the infinite range, no gaps filled', ()=>{
      var result = DateRange.addRange([date1, date2], [[undefined, undefined]]);
      expect(result.gaps_filled).toEqual([]);
      expect(result.new_ranges).toEqual([[undefined, undefined]]);
    });
  });

  describe('-Infinity to definite date exists', ()=>{
    describe('with gaps', ()=>{
      var ranges = [[undefined, date1], [date2, date3], [date4, date5]];

      describe('new range low low', ()=>{
        var new_range = [undefined, date01];
        it('no gaps filled', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([])
          expect(result.new_ranges).toEqual(ranges);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date31];
        it('fills mid gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date2], [date3, date31]]);
          expect(result.new_ranges).toEqual([[undefined, date31], [date4, date5]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date2], [date3, date4], [date5, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });


      describe('new range mid mid', ()=>{
        var new_range = [date11, date41];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date11, date2], [date3, date4]])
          expect(result.new_ranges).toEqual([[undefined, date1], [date11, date5]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date11, date61];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date11, date2], [date3, date4], [date5, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date1], [date11, date61]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, date61];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date5, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date1], [date2, date3], [date4, date61]]);
        });
      });

    });

    describe('no gaps', ()=>{
      var ranges = [[undefined, date1]];

      describe('new range low low', ()=>{
        var new_range = [undefined, date01];
        it('no gaps filled', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([])
          expect(result.new_ranges).toEqual([[undefined, date1]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date1];
        it('fills mid gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[undefined, date1]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });


      describe('new range mid mid', ()=>{
        var new_range = [date01, date1];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([])
          expect(result.new_ranges).toEqual([[undefined, date1]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date1, date61];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, date61];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date5, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date1], [date5, date61]]);
        });
      });
    });
  });

  describe('definite to Infinity range exists', ()=>{
    describe('with gaps', ()=>{
      var ranges = [[date1, date2], [date3, date4], [date5, undefined]];

      describe('new range low low', ()=>{
        var new_range = [undefined, date01];
        it('no gaps filled', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, date2], [date3, date4], [date5, undefined]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date3];
        it('fills mid gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3]]);
          expect(result.new_ranges).toEqual([[undefined, date4], [date5, undefined]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3], [date4, date5]]);
          expect(result.new_ranges).toEqual([[undefined, undefined]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date1, date41];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date2, date3], [date4, date41]]);
          expect(result.new_ranges).toEqual([[date1, date41], [date5, undefined]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date31, date61];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date4, date5]]);
          expect(result.new_ranges).toEqual([[date1, date2], [date3, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, date61];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, date2], [date3, date4], [date5, undefined]]);
        });
      });
    });

    describe('no gaps', ()=>{
      var ranges = [[date1, undefined]];

      describe('new range low low', ()=>{
        var new_range = [undefined, date01];
        it('no gaps filled', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, undefined]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date1];
        it('fills mid gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1]]);
          expect(result.new_ranges).toEqual([[undefined, undefined]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1]]);
          expect(result.new_ranges).toEqual([[undefined, undefined]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date1, date1];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, undefined]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date1, undefined];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, undefined];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, undefined]]);
        });
      });

    });
  });

  describe('definite range exists', ()=>{
    describe('with gaps', ()=>{
      var ranges = [[date1, date2], [date3, date4], [date5, date6]];

      describe('new range low low', ()=>{
        var new_range = [undefined, date01];
        it('no gaps filled', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, date2], [date3, date4], [date5, date6]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date41];
        it('fills mid gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3], [date4, date41]]);
          expect(result.new_ranges).toEqual([[undefined, date41], [date5, date6]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3], [date4, date5], [date6, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date11, date41];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date2, date3], [date4, date41]]);
          expect(result.new_ranges).toEqual([[date1, date41], [date5, date6]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date31, undefined];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date4, date5], [date6, undefined]]);
          expect(result.new_ranges).toEqual([[date1, date2], [date3, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date61, undefined];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date61, undefined]]);
          expect(result.new_ranges).toEqual([[date1, date2], [date3, date4], [date5, date6], [date61, undefined]]);
        });
      });

    });

    describe('no gaps', ()=>{
      var ranges = [[date1, date2]];

      describe('new range low low', ()=>{
        var new_range = [undefined, date01];
        it('no gaps filled', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, date2]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date11];
        it('fills mid gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1]]);
          expect(result.new_ranges).toEqual([[undefined, date2]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date11, date2];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, date2]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date11, undefined];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date2, undefined]]);
          expect(result.new_ranges).toEqual([[date1, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date61, undefined];
        it('includes gaps', ()=>{
          var result = DateRange.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date61, undefined]]);
          expect(result.new_ranges).toEqual([[date1, date2], [date61, undefined]]);
        });
      });

    });
  });

});
