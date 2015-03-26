'use strict';

describe('Sprite', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function (_Sprite_) {
    that.Sprite = _Sprite_;
  }));

  it('calls the progress route', function() {
    that.Sprite.index().then(function(data) {
      expect(data).to.eql({progress: 100});
    });
  });
});0