'use strict';

function SpriteService() {

  /*
   * opts.context         Canvas 2D context
   * opts.image           Image element, make sure source is loaded first!
   * opts.flippable       true if the lower half of the image is a mirror of the top half
   * opts.frameCount      Number of frames in the sprite (if animated)
   * opts.ticksPerFrame   Number of ticks (60fps) per frame of animation.
   *                        i.e. for 30 frames per second, this would be 2
   * opts.crop            Optional crop array in format: [x, y, width, height]
   *                        Cropped images cannot be animated or flipped!
   */
  function Sprite(opts) {
    this.context = opts.context;
    this.image = opts.image;

    this.flippable = opts.flippable;

    if (opts.crop) {
      this._xOffset = opts.crop[0];
      this._yOffset = opts.crop[1];
      this.width = opts.crop[2];
      this.height = opts.crop[3];
    } else {
      this.height = opts.flippable ? this.image.height / 2 : this.image.height;
      this._yOffset = 0; // used for accessing mirrored half of image, if flippable

      this.ticksPerFrame = this.ticksPerFrame || 1;
      this.frameCount = opts.frameCount || 1;
      this.width = this.image.width / this.frameCount;
      this._xOffset = 0;
    }

    // Initialize animation properties
    this._frameIndex = 0;
    this._tick = 0;
  }

  Sprite.prototype.reset = function () {
    this._frameIndex = 0;
    this._xOffset = 0;
    this._tick = 0;
  };

  Sprite.prototype.update = function () {
    this._tick += 1;
    if (this.frameCount === 1) return;

    if (this._tick > this.ticksPerFrame) {
      this._tick = 0;

      if (this._frameIndex < this.frameCount - 1) {
        this._frameIndex += 1;
        this._xOffset = this._frameIndex * this.width;
      } else {
        this._frameIndex = 0;
        this._xOffset = 0;
      }
    }
  };

  Sprite.prototype.flip = function() {
    if (!this.flippable) {
      console.log('Cannot flip sprite - flippable is set to false');
      return;
    }
    this._yOffset = this.height;
  };

  Sprite.prototype.unflip = function() {
    if (!this.flippable) {
      console.log('Cannot flip sprite - flippable is set to false');
      return;
    }
    this._yOffset = 0;
  };

  Sprite.prototype.clear = function (x, y, scale) {
    if (scale) {
      var scaled = this.calculateScale(x, y, scale);
      this.context.clearRect(scaled.x, scaled.y, scaled.width, scaled.height);
    } else {
      this.context.clearRect(x, y, this.width, this.height);
    }
  };

  Sprite.prototype.calculateScale = function(x, y, scale) {
    var width = Math.round(this.width * scale);
    var height = Math.round(this.height * scale);
    x = Math.round(x - (width - this.width) / 2);
    y = Math.round(y - (height - this.height) / 2);
    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  };

  Sprite.prototype.render = function (x, y, scale) {
    var width;
    var height;
    x = Math.round(x);
    y = Math.round(y);

    if (scale) {
      var props = this.calculateScale(x, y, scale);
      x = props.x;
      y = props.y;
      width = props.width;
      height = props.height;
    } else {
      width = this.width;
      height = this.height;
    }
    this.context.drawImage(
      this.image,
      this._xOffset,
      this._yOffset,
      this.width,
      this.height,
      x,
      y,
      width,
      height
    );
  };

  return Sprite;
}

module.exports = SpriteService;