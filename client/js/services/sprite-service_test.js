'use strict';

describe.only('Sprite', function() {
  var that = this;
  var Sprite;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function (_Sprite_) {
    that.fakeContext = {
      drawImage: function() {}
    };
    Sprite = _Sprite_;
  }));

  describe('animated sprite', function() {
    describe('initialize', function() {
      describe('uncropped', function() {
        beforeEach(function() {
          var image = new Image();
          image.width = 60;
          image.height = 20;

          that.sprite = new Sprite({
            context: that.fakeContext,
            image: image,
            frameCount: 3
          });
        });

        it('sets dimensions to the first frame', function() {
          expect(that.sprite.width).to.equal(20);
          expect(that.sprite._yOffset).to.equal(0);
        });
      });

      describe('cropped', function() {
        beforeEach(function() {
          var image = new Image();
          image.width = 40;
          image.height = 40;

          that.sprite = new Sprite({
            context: that.fakeContext,
            image: image,
            crop: [10, 20, 40, 30]
          });
        });

        it('crops the dimensions of the image', function() {
          expect(that.sprite._xOffset).to.equal(10);
          expect(that.sprite._yOffset).to.equal(20);
          expect(that.sprite.width).to.equal(40);
          expect(that.sprite.height).to.equal(30);
        });
      });
    });
    
    describe('update', function() {
      beforeEach(function() {
        that.sprite = new Sprite({
          context: that.fakeContext,
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

    describe('flippable', function() {
      beforeEach(function() {
        var image = new Image();
        image.width = 20;
        image.height = 40;
        that.sprite = new Sprite({
          context: that.fakeContext,
          image: image,
          flippable: true
        });
      });

      it('only uses the top half of the image', function() {
        expect(that.sprite.width).to.equal(20);
        expect(that.sprite.height).to.equal(20);
      });

      it('points to the mirrored part of the sprite', function() {
        that.sprite.flip();
        expect(that.sprite._yOffset).to.equal(20);
      });

      it('points to the mirrored part of the sprite', function() {
        that.sprite._yOffset = 20;
        that.sprite.unflip();
        expect(that.sprite._yOffset).to.equal(0);
      });
    });

    describe('render', function() {
      beforeEach(function() {
        that.image = new Image();
        that.image.width = 20;
        that.image.height = 20;
        that.sprite = new Sprite({
          context: that.fakeContext,
          image: that.image
        });
        that.spy = sinon.spy(that.fakeContext, 'drawImage');
      });

      describe('without scale', function() {
        it('draws the sprite', function() {
          that.sprite.render(10, 10);
          expect(that.spy).to.have.been.calledWith(
            that.image,
            0,
            0,
            20,
            20,
            10,
            10,
            20,
            20
          );
        });
      });

      describe('with scale', function() {
        it('draws the sprite', function() {
          that.sprite.render(10, 10, 2.0);
          expect(that.spy).to.have.been.calledWith(
            that.image,
            0,
            0,
            20,
            20,
            0,
            0,
            40,
            40
          );
        });
      });
    });
  });
});