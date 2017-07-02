/*the module in folder-1*/
var mom = require('../../folder-1').saysmom;

describe('first test', function() {
  it('should return wow', function(){
    expect(mom.saysmom12).toBe("wow");
  });
});
