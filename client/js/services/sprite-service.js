'use strict';

function SpriteService() {

  /*
   * opts.context         Canvas 2D context
   * opts.image           Image element, make sure source is loaded first!
   * opts.flippable       true if the lower half of the image is a mirror of the top half
   * opts.frameCount      Number of frames in the sprite (if animated)
   * opts.ticksPerFrame   Number of ticks (60fps) per frame of animation.
   *                        i.e. for 30 frames per second, this would be 2
   */
  function Sprite(opts) {
    this.context = opts.context;
    this.image = opts.image;

    this.flippable = opts.flippable;

    this.height = opts.flippable ? this.image.height / 2 : this.image.height;
    this.yOffset = 0; // used for accessing mirrored half of image, if flippable

    this.ticksPerFrame = this.ticksPerFrame || 1;
    this.frameCount = opts.frameCount || 1;
    this.width = this.image.width / this.frameCount;

    // Initialize animation properties
    this._frameIndex = 0;
    this._tick = 0;

  }

  Sprite.prototype.reset = function () {
    this._frameIndex = 0;
    this._tick = 0;
  };

  Sprite.prototype.update = function () {
    this._tick += 1;
    if (this.frameCount === 1) return;

    if (this._tick > this.ticksPerFrame) {
      this._tick = 0;

      if (this._frameIndex < this.frameCount - 1) {
        this._frameIndex += 1;
      } else {
        this._frameIndex = 0;
      }
    }
  };

  Sprite.prototype.flip = function() {
    if (!this.flippable) {
      console.log('Cannot flip sprite - flippable is set to false');
      return;
    }
    this.yOffset = this.height;
  };

  Sprite.prototype.unflip = function() {
    if (!this.flippable) {
      console.log('Cannot flip sprite - flippable is set to false');
      return;
    }
    this.yOffset = 0;
  };

  Sprite.prototype.render = function (x, y) {
    var that = this;

    this.context.drawImage(
      that.image,
      that.frameIndex * that.width,
      that.yOffset,
      that.width,
      that.height,
      Math.floor(x),
      Math.floor(y),
      that.width,
      that.height
    );
  };

  return Sprite;
}

module.exports = SpriteService;