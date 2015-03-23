'use strict';

module.exports = ['Character', 'Sprite', 'DesignSequence', function(Character, Sprite, DesignSequence) {
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

      function showCompletion(message) {
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'black';
        setTimeout(function() {
          context.font = '60px Open Sans';
          context.fillText('DESIGN STATUS:', 270, 240);
        }, 700);
        setTimeout(function() {
          context.font = '100px Open Sans';
          context.fillText(message.text, message.x, message.y);
        }, 1400);
      }

      var step = 1;

      var sequence = DesignSequence[10];

      function loop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (sequence[step](morgan)) {
          step++;
        }

        morgan.update();
        morgan.render();

        if (sequence[step]) {
          window.requestAnimationFrame(loop);
        } else {
          showCompletion(sequence.complete);
        }
      }

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