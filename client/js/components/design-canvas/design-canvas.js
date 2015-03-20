'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      current: '=',
      barMax: '=',
      barMin: '='
    },
    replace: true,
    template: require('./design-canvas-template.jade'),
    controller: require('./design-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0];
      var context = canvas.getContext('2d');
      var morganRun;
      var morganJump;

      function Sprite(opts) {
        this.context = opts.context;
        this.width = opts.width;
        this.height = opts.height;
        this.image = opts.image;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 1;
        this.frameCount = 18;
      }

      Sprite.prototype.reset = function() {
        this.frameIndex = 0;
        this.tickCount = 0;
      };

      Sprite.prototype.setImage = function(image, frameCount) {
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.frameCount = frameCount;
      };

      Sprite.prototype.update = function() {
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

      Sprite.prototype.render = function(x, y) {
        var that = this;

        this.context.drawImage(
          that.image,
          that.frameIndex * (that.width / that.frameCount),
          0,
          that.width / that.frameCount,
          that.height,
          Math.floor(x),
          Math.floor(y),
          that.width / that.frameCount,
          that.height
        );
      };

      /*
       * @param sprite     Sprite instance
       * @param position   Initial [x, y] position
       */
      function Morgan(sprite, position) {
        this.sprite = sprite;
        this.x = position[0];
        this.y = position[1];
        this.vector = [0, 0];
      }

      Morgan.prototype.setState = function(state) {
        if (state === 'running') {
          this.sprite.setImage(morganRun, 18);
          this.vector = [3, 0];
        } else if (state === 'stopped') {
          this.vector = [0, 0];
        } else if (state === 'jumping') {
          this.sprite.setImage(morganJump, 18);
          this.vector[1] = -8;
        }
        this.state = state;
        this.sprite.reset();
      };

      Morgan.prototype.render = function() {
        this.sprite.render(this.x, this.y);
      };

      Morgan.prototype.update = function() {
        if (this.state === 'jumping') {
          this.vector[1] += 0.5;
        }
        this.x += this.vector[0];
        this.y += this.vector[1];
        this.sprite.update();
      };

      var morgan = new Morgan(
        new Sprite({context: context}),
        [-50, 373]
      );

      function showCompletion(text) {
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'black';
        setTimeout(function() {
          context.font = '60px Open Sans';
          context.fillText('DESIGN STATUS:', 270, 240);
        }, 700);
        setTimeout(function() {
          context.font = '100px Open Sans';
          context.fillText(text, 120, 340);
        }, 1400);
      }

      var step = 1;

      function loop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (sequence2[step](morgan)) {
          step++;
        }

        morgan.update();
        morgan.render();

        if (sequence2[step]) {
          window.requestAnimationFrame(loop);
        }
      }

      var sequence1 = {
        1: function(morgan) {
          if (morgan.x > 130) {
            morgan.setState('jumping');
            return true;
          }
          return false;
        },
        2: function(morgan) {
          if (morgan.y > 580) {
            showCompletion('JUST STARTED');
            return true;
          }
          return false;
        }
      };

      var sequence2 = {
        1: function(morgan) {
          if (morgan.x > 130) {
            morgan.setState('jumping');
            return true;
          }
          return false;
        },
        2: function(morgan) {
          if (morgan.y > 416) {
            morgan.setState('stopped');
            morgan.setState('running');
            return true;
          }
          return false;
        },
        3: function(morgan) {
          if (morgan.x > 390) {
            morgan.setState('jumping');
            return true;
          }
          return false;
        },
        4: function(morgan) {
          if (morgan.y > 580) {
            showCompletion('GETTING THERE');
            return true;
          }
          return false;
        }
      };

      scope.$watch('vm.morganSrc', function(newValue) {
        var loaded = 0;

        function afterAllLoaded() {
          loaded++;
          if (loaded === 2) {
            morgan.setState('running');
            loop();
          }
        }
        if (!newValue) return;
        morganRun = new Image();
        morgan.image = morganRun;
        morganJump = new Image();
        morganRun.onload = afterAllLoaded;
        morganJump.onload = afterAllLoaded;
        morganRun.src = newValue.run;
        morganJump.src = newValue.jump;

      });
    }
  };
};