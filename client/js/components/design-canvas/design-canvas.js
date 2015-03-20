'use strict';

module.exports = ['Character', function(Character) {
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
      var morgan;

      function Sprite(opts) {
        this.context = opts.context;
        this.image = opts.image;
        this.width = this.image.width;
        this.height = this.image.height;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = this.ticksPerFrame || 1;
        this.frameCount = opts.frameCount;
      }

      Sprite.prototype.reset = function() {
        this.frameIndex = 0;
        this.tickCount = 0;
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
            morgan.setState('idle');
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
        if (!newValue) return;

        var loaded = 0;
        function afterAllLoaded() {
          loaded++;
          if (loaded === 2) {
            morgan = new Character({
              sprites: {
                running: new Sprite({context: context, image: morganRun, frameCount: 18}),
                // TODO idle animation once it exists!
                idle: new Sprite({context: context, image: morganRun, frameCount: 18}),
                jumping: new Sprite({context: context, image: morganJump, frameCount: 18})
              },
              x: -50,
              y: 373
            });

            morgan.setState('running');
            loop();
          }
        }
        var morganRun = new Image();
        var morganJump = new Image();

        morganRun.onload = afterAllLoaded;
        morganJump.onload = afterAllLoaded;
        morganRun.src = newValue.run;
        morganJump.src = newValue.jump;
      });
    }
  };
}];