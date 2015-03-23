'use strict';

function SpriteService() {
  function Sprite(opts) {
    this.context = opts.context;
    this.image = opts.image;
    this.width = this.image.width;
    this.height = this.image.height / 2;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = this.ticksPerFrame || 1;
    this.frameCount = opts.frameCount;
    this.yOffset = 0;
  }

  Sprite.prototype.reset = function () {
    this.frameIndex = 0;
    this.tickCount = 0;
  };

  Sprite.prototype.update = function () {
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;

      if (this.frameIndex < this.frameCount - 1) {
        this.frameIndex += 1;
      } else {
        this.frameIndex = 0;
      }
    }
  };

  Sprite.prototype.flip = function() {
    this.yOffset = this.height;
  };

  Sprite.prototype.unflip = function() {
    this.yOffset = 0;
  };

  Sprite.prototype.render = function (x, y) {
    var that = this;

    this.context.drawImage(
      that.image,
      that.frameIndex * (that.width / that.frameCount),
      that.yOffset,
      that.width / that.frameCount,
      that.height,
      Math.floor(x),
      Math.floor(y),
      that.width / that.frameCount,
      that.height
    );
  };

  return Sprite;
}

module.exports = SpriteService;