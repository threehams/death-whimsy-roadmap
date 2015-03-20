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

  Character.prototype.setState = function(state) {
    if (state === 'running') {
      this.sprite = this.sprites.running;
      this.vector = [3, 0];
    } else if (state === 'idle') {
      this.sprite = this.sprites.idle;
      this.vector = [0, 0];
    } else if (state === 'jumping') {
      this.sprite = this.sprites.jumping;
      this.vector[1] = -8;
    }
    this.state = state;
    this.sprite.reset();
  };

  Character.prototype.render = function() {
    this.sprite.render(this.x, this.y);
  };

  Character.prototype.update = function() {
    if (this.state === 'jumping') {
      this.vector[1] += 0.5;
    }
    this.x += this.vector[0];
    this.y += this.vector[1];
    this.sprite.update();
  };

  return Character;
}

module.exports = CharacterService;