'use strict';

function CharacterService() {
  /*
   * @param sprites    Object of states mapped to sprites.
   * @param position   Initial [x, y] position
   */
  function Character(opts) {
    this.sprites = opts.sprites;
    this.x = opts.x;
    this.y = opts.y;
    this.vector = [0, 0];
  }

  Character.prototype.setState = function(state, opts) {
    opts = opts || {};
    if (state === 'running') {
      this.sprite = this.sprites.running;
      if (opts.reverse === true) {
        this.sprites.running.flip();
        this.vector = [-3, 0];
      } else {
        this.sprites.running.unflip();
        this.vector = [3, 0];
      }
    } else if (state === 'idle') {
      this.sprite = this.sprites.idle;
      this.vector = [0, 0];
    } else if (state === 'jumping') {
      this.sprite = this.sprites.jumping;
      if (opts.reverse === true) {
        this.sprites.jumping.flip();
      } else {
        this.sprites.jumping.unflip();
      }
      this.vector[1] = -8;
    } else if (state === 'falling') {
      this.sprite = this.sprites.jumping;
      if (opts.reverse === true) {
        this.sprites.jumping.flip();
      } else {
        this.sprites.jumping.unflip();
      }
      this.vector[1] = 0;
    } else if (state === 'dashing') {
      this.sprite = this.sprites.jumping;
      if (opts.reverse === true) {
        this.sprites.jumping.flip();
      } else {
        this.sprites.jumping.unflip();
      }
      this.vector = [25, 0];
    }
    this.state = state;
    this.sprite.reset();
  };

  Character.prototype.render = function() {
    this.sprite.render(this.x, this.y);
  };

  Character.prototype.update = function() {
    if (this.state === 'jumping' || this.state === 'falling') {
      this.vector[1] += 0.5;
    }
    this.x += this.vector[0];
    this.y += this.vector[1];
    this.sprite.update();
  };

  Character.prototype.clear = function() {
    this.sprite.clear(this.x, this.y);
  };

  return Character;
}

module.exports = CharacterService;