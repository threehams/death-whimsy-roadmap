'use strict';

function DesignCanvasController ($q, $scope, $window, Character, Sprite, ImagePreloader, DesignSequence) {
  var vm = this;
  var progress = 0;

  vm.progress = 0;
  vm.description = 'This is example text for description of current progress. You can put whatever you want here!';

  $q.all([
    ImagePreloader.load('/img/morgan-run.png'),
    ImagePreloader.load('/img/morgan-jump.png')
  ]).then(function(images) {
    vm.morgan = new Character({
      sprites: {
        running: new Sprite({context: vm.context, image: images[0], frameCount: 18, flippable: true}),
        // TODO idle animation once it exists!
        idle: new Sprite({context: vm.context, image: images[0], frameCount: 18, flippable: true}),
        jumping: new Sprite({context: vm.context, image: images[1], frameCount: 18, flippable: true})
      },
      x: -50,
      y: 348
    });
    vm.morgan.setState('running');
    vm.loaded = true;
    vm.sequence = DesignSequence[Math.floor(vm.progressEnd / 10) * 10];
    vm.step = 1;

    if (vm.active) {
      vm.loop();
    }
  });

  $scope.$watch('vm.active', function(newValue) {
    if (newValue && vm.loaded) {
      vm.loop();
    }
  });

  vm.digestLoop = function() {
    vm.loop();
    $scope.$digest();
  };

  vm.loop = function() {
    if (!vm.sequence[vm.step]) {
      vm.done = true;
      // Uncomment to log number of animation frames
      console.log(progress);
      return;
    }

    var done = (vm.sequence[vm.step](vm.morgan));
    if (done) vm.step++;

    vm.morgan.clear();
    vm.morgan.update();
    vm.morgan.render();

    progress++;
    vm.progress = progress / vm.sequence.frames * 100;

    if (vm.active) $window.requestAnimationFrame(vm.digestLoop);
  };

}

DesignCanvasController.$inject = ['$q', '$scope', '$window', 'Character', 'Sprite', 'ImagePreloader', 'DesignSequence'];

module.exports = DesignCanvasController;