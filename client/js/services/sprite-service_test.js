'use strict';

describe.only('Sprite', function() {
  var that = this;
  var Sprite;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function (_Sprite_) {
    this.fakeContext = {
      drawImage: function() {}
    };
    Sprite = _Sprite_;
  }));

  describe('animated sprite', function() {
    describe('update', function() {
      beforeEach(function() {
        that.sprite = new Sprite({
          context: that.context,
          image: new Image(),
          ticksPerFrame: 6,
          frameCount: 2
        });
      });

      it('increments frameIndex when ticksPerFrame is matched', function() {
        _.times(6, function() {
          that.sprite.update();
        });
        expect(that.sprite._frameIndex).to.equal(1);
      });

      it('resets frameCount when it equals frameIndex', function() {
        _.times(12, function() {
          that.sprite.update();
        });
        expect(that.sprite._frameIndex).to.equal(0);
      });

      it('does not update frameIndex before the ticksPerFrame is reached', function() {
        _.times(5, function() {
          that.sprite.update();
        });
        expect(that.sprite._frameIndex).to.equal(0);
      });
    });
  });

  describe('static sprite', function() {

  });
});