'use strict';

module.exports = ['Character', 'Sprite', 'DesignSequence', function(Character, Sprite, DesignSequence) {
  return {
    restrict: 'E',
    scope: {
      active: '='
    },
    replace: true,
    template: require('./design-canvas-template.jade'),
    controller: require('./design-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('.design-canvas');
      var context = canvas.getContext('2d');
      var morgan;
      var progress = 0;

      function showCompletion() {
        scope.vm.progressDone = true;
        scope.$digest();
      }

      var step = 1;

      var sequence = DesignSequence[10];

      scope.vm.loop = function() {
        context.clearRect(morgan.x - 2, morgan.y - 2, morgan.x + 2, morgan.y + 2);
        if (!sequence[step]) {
          showCompletion(sequence.complete);
          return;
        }

        if (sequence[step](morgan)) {
          step++;
        }

        morgan.update();
        morgan.render();

        progress++;
        scope.vm.progress = progress * (scope.vm.currentProgress / sequence.frames);

        if (scope.vm.active) {
          window.requestAnimationFrame(scope.vm.loop);
          scope.$digest();
        }
      };

      scope.$watch('vm.active', function(newValue) {
        if (newValue) {
          scope.vm.loop();
        }
      });

      scope.$watch('vm.morganSrc', function(newValue) {
        if (!newValue) return;

        var loaded = 0;
        function afterAllLoaded() {
          loaded++;
          if (loaded === 2) {
            morgan = new Character({
              sprites: {
                running: new Sprite({context: context, image: morganRun, frameCount: 18, flippable: true}),
                // TODO idle animation once it exists!
                idle: new Sprite({context: context, image: morganRun, frameCount: 18, flippable: true}),
                jumping: new Sprite({context: context, image: morganJump, frameCount: 18, flippable: true})
              },
              x: -50,
              y: 373
            });

            morgan.setState('running');
            if (scope.vm.active) {
              scope.vm.loop();
            }
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