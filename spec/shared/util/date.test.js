"use strict";

import DateUtil from './../../../shared/utils/date.js';

function rangeEquivalent(range1, range2){
  if (range1 && !range2 || !range1 && range2) return false
    var equivalent = true
  if (range1[0] && range2[0]) {
    equivalent = range1[0].getTime() === range2[0].getTime();
  } else {
    equivalent = range1[0] === range2[0];
  }
  if (!equivalent) return false;
  if (range1[1] && range2[1]) {
    equivalent = range1[1].getTime() === range2[1].getTime();
  } else {
    equivalent = range1[1] === range2[1];
  }
  return equivalent
}
function rangesEquivalent(a1, a2){
    var match = true;
    if (a1.length !== a2.length) return false;
    a1.forEach((range, i)=>{
      if (!rangeEquivalent(range, a2[i])) match = false; return false;
    });
    return match;
}


describe('DateUtil.gte', ()=>{

  it('considers undefined as a large date', ()=>{
    var date1 = new Date(),
      date2 = new Date(date1.getTime() + 1000);
    expect(DateUtil.gte(undefined, date1)).toEqual(true);
    expect(DateUtil.gte(undefined, undefined)).toEqual(true);
    expect(DateUtil.gte(date1, undefined)).toEqual(false);
    expect(DateUtil.gte(date1, date2)).toEqual(false);
    expect(DateUtil.gte(date2, date1)).toEqual(true);
  });
});


describe('DateUtil.lte', ()=>{
  it('considers undefined as a small date', ()=>{
    var date1 = new Date(),
      date2 = new Date(date1.getTime() + 1000);
    expect(DateUtil.lte(undefined, date1)).toEqual(true);
    expect(DateUtil.lte(undefined, undefined)).toEqual(true);
    expect(DateUtil.lte(date1, undefined)).toEqual(false);
    expect(DateUtil.lte(date1, date2)).toEqual(true);
    expect(DateUtil.lte(date2, date1)).toEqual(false);
  });
});

describe('DateUtil.addRange', ()=>{
  var date1 = new Date(),
    date01 = DateUtil.add(date1, -1000),
    date11 = DateUtil.add(date1, 1000),
    date2 = DateUtil.add(date1, 2000),
    date21 = DateUtil.add(date2, 1000),
    date3 = DateUtil.add(date2, 2000),
    date31 = DateUtil.add(date3, 1000),
    date4 = DateUtil.add(date3, 2000),
    date41 = DateUtil.add(date4, 1000),
    date5 = DateUtil.add(date4, 2000),
    date51 = DateUtil.add(date5, 1000),
    date6 = DateUtil.add(date5, 2000),
    date61 = DateUtil.add(date6, 1000),
    date7 = DateUtil.add(date6, 2000),
    date71 = DateUtil.add(date7, 1000);

  describe('no ranges exist', ()=>{
    it('returns the new ranges', ()=>{
      var result = DateUtil.addRange([date1, date2], []);
      expect(rangesEquivalent(result.gaps_filled, [[date1, date2]])).toBeTruthy();
      expect(rangesEquivalent(result.new_ranges, [[date1, date2]])).toBeTruthy();
    });
  });

  describe('infinite range exists', ()=>{
    it('returns the infinite range, no gaps filled', ()=>{
      var result = DateUtil.addRange([date1, date2], [[undefined, undefined]]);
      expect(rangesEquivalent(result.gaps_filled, [])).toBeTruthy();
      expect(rangesEquivalent(result.new_ranges, [[undefined, undefined]])).toBeTruthy();
    });
  });

  describe('-Infinity to definite date exists', ()=>{
    describe('with gaps', ()=>{
      var ranges = [[undefined, date1], [date2, date3], [date4, date5]];

      describe('new range low low', ()=>{
        var new_range = [undefined, date01];
        it('no gaps filled', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([])
          expect(result.new_ranges).toEqual(ranges);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date31];
        it('fills mid gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date2], [date3, date31]]);
          expect(result.new_ranges).toEqual([[undefined, date31], [date4, date5]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date2], [date3, date4], [date5, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });


      describe('new range mid mid', ()=>{
        var new_range = [date11, date41];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date11, date2], [date3, date4]])
          expect(result.new_ranges).toEqual([[undefined, date1], [date11, date5]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date11, date61];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date11, date2], [date3, date4], [date5, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date1], [date11, date61]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, date61];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
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
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([])
          expect(result.new_ranges).toEqual([[undefined, date1]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date1];
        it('fills mid gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[undefined, date1]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });


      describe('new range mid mid', ()=>{
        var new_range = [date01, date1];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([])
          expect(result.new_ranges).toEqual([[undefined, date1]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date1, date61];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date1, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, date61];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
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
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, date2], [date3, date4], [date5, undefined]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date3];
        it('fills mid gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3]]);
          expect(result.new_ranges).toEqual([[undefined, date4], [date5, undefined]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3], [date4, date5]]);
          expect(result.new_ranges).toEqual([[undefined, undefined]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date1, date41];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date2, date3], [date4, date41]]);
          expect(result.new_ranges).toEqual([[date1, date41], [date5, undefined]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date31, date61];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date4, date5]]);
          expect(result.new_ranges).toEqual([[date1, date2], [date3, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, date61];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
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
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, undefined]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date1];
        it('fills mid gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1]]);
          expect(result.new_ranges).toEqual([[undefined, undefined]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1]]);
          expect(result.new_ranges).toEqual([[undefined, undefined]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date1, date1];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, undefined]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date1, undefined];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date5, undefined];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
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
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, date2], [date3, date4], [date5, date6]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date41];
        it('fills mid gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3], [date4, date41]]);
          expect(result.new_ranges).toEqual([[undefined, date41], [date5, date6]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date3], [date4, date5], [date6, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date11, date41];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date2, date3], [date4, date41]]);
          expect(result.new_ranges).toEqual([[date1, date41], [date5, date6]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date31, undefined];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date4, date5], [date6, undefined]]);
          expect(result.new_ranges).toEqual([[date1, date2], [date3, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date61, undefined];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
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
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date01]]);
          expect(result.new_ranges).toEqual([[undefined, date01], [date1, date2]]);
        });
      });

      describe('new range low mid', ()=>{
        var new_range = [undefined, date11];
        it('fills mid gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1]]);
          expect(result.new_ranges).toEqual([[undefined, date2]]);
        });
      });

      describe('new range low high', ()=>{
        var new_range = [undefined, date61];
        it('fills mid and high gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[undefined, date1], [date2, date61]]);
          expect(result.new_ranges).toEqual([[undefined, date61]]);
        });
      });

      describe('new range mid mid', ()=>{
        var new_range = [date11, date2];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([]);
          expect(result.new_ranges).toEqual([[date1, date2]]);
        });
      });

      describe('new range mid high', ()=>{
        var new_range = [date11, undefined];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date2, undefined]]);
          expect(result.new_ranges).toEqual([[date1, undefined]]);
        });
      });

      describe('new range high high', ()=>{
        var new_range = [date61, undefined];
        it('includes gaps', ()=>{
          var result = DateUtil.addRange(new_range, ranges);
          expect(result.gaps_filled).toEqual([[date61, undefined]]);
          expect(result.new_ranges).toEqual([[date1, date2], [date61, undefined]]);
        });
      });

    });
  });

});
