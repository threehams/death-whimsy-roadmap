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
    link: function(scope, element, attrs) {
      var canvas = element.find('canvas')[0];
      var context = canvas.getContext('2d');

      function Sprite(opts) {
        this.context = opts.context;
        this.width = opts.width;
        this.height = opts.height;
        this.image = opts.image;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 1;
        this.numberOfFrames = 18;
      }

      Sprite.prototype.render = function(xOffset, yOffset) {
        var that = this;

        this.context.clearRect(0, 0, 1000, 500);

        this.context.drawImage(
          that.image,
          that.frameIndex * (that.width / that.numberOfFrames),
          0,
          that.width / that.numberOfFrames,
          that.height,
          20 + xOffset,
          373,
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
      function loop() {
        window.requestAnimationFrame(loop);

        morgan.update();
        xOffset += 2.5;
        morgan.render(xOffset);
      }

      scope.$watch('vm.morganSrc', function(newValue) {
        if (!newValue) return;
        var morganRun = new Image();
        morgan.image = morganRun;
        morganRun.onload = function() {
          loop();
        };
        morganRun.src = '/img/morgan-run.png';

      });
    }
  };
};