'use strict';
describe('Service :: Params', function() {
  var service,
    $locationMock = {
      search: function() {
        return {
          A: 1,
          b: 2
        }
      }
    };
  beforeEach(module(function($provide) {
    $provide.value('$location', $locationMock);
  }));
  beforeEach(module('trunk'));
  // instantiate service
  beforeEach(inject(function(_ParamsSrv_) {
    service = _ParamsSrv_;
  }));
  it(':: Init',function(){
    expect(service).toEqual({
      A: 1,
      B: 2
    });
  })
});
