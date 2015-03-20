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
        this.numberOfFrames = 18;

        this.state = 'running';
      }

      Sprite.prototype.render = function(xOffset, yOffset) {
        var that = this;

        this.context.drawImage(
          that.image,
          that.frameIndex * (that.width / that.numberOfFrames),
          0,
          that.width / that.numberOfFrames,
          that.height,
          Math.floor(-50 + xOffset),
          Math.floor(373 + yOffset),
          that.width / that.numberOfFrames,
          that.height
        );
      };

      Sprite.prototype.update = function() {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;

          if (this.frameIndex < this.numberOfFrames - 1) {
            this.frameIndex += 1;
          } else {
            this.frameIndex = 0;
          }
        }
      };

      var morgan = new Sprite({context: context, width: 720, height: 50});

      var xOffset = 0;
      var yOffset = 0;

      function showCompletion() {
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'black';
        context.font = '100px Open Sans';
        context.fillText('JUST STARTED', 180, 320);
      }

      function loop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (yOffset < 300) {
          window.requestAnimationFrame(loop);
        } else {
          return showCompletion();
        }

        morgan.update();
        xOffset += 2.5;
        if (xOffset > 170) {
          if (morgan.state === 'running') {
            console.log('jumping!');
            morgan.image = morganJump;
            morgan.state = 'jumping';
          }
          yOffset += Math.round(-8 + (xOffset - 170) * 0.2);
        }
        morgan.render(xOffset, yOffset);
      }

      scope.$watch('vm.morganSrc', function(newValue) {
        var loaded = 0;
        if (!newValue) return;
        morganRun = new Image();
        morgan.image = morganRun;
        morganJump = new Image();
        morganRun.onload = function() {
          loaded++;
          if (loaded > 1) {
            loop();
          }
        };
        morganJump.onload = function() {
          loaded++;
          if (loaded > 1) {
            loop();
          }
        };
        morganRun.src = newValue.run;
        morganJump.src = newValue.jump;

      });
    }
  };
};