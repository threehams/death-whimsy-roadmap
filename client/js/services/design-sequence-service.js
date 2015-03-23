'use strict';

function DesignSequenceService() {
  var sequences = {};
  sequences[1] = {
    1: function(morgan) {
      if (morgan.x < 130) return false;
      morgan.setState('jumping');
      return true;
    },
    2: function(morgan) {
      if (morgan.y < 580) return false;
      //showCompletion('JUST STARTED');
      return true;
    }
  };

  sequences[2] = {
    1: function(morgan) {
      if (morgan.x < 130) return false;
      morgan.setState('jumping');
      return true;
    },
    2: function(morgan) {
      if (morgan.y < 416) return false;
      morgan.setState('idle');
      morgan.setState('running');
      return true;
    },
    3: function(morgan) {
      if (morgan.x < 390) return false;
      morgan.setState('jumping');
      return true;
    },
    4: function(morgan) {
      if (morgan.y < 580) return false;
      //showCompletion('GETTING THERE');
      return true;
    }
  };

  sequences[10] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 416) {
        morgan.setState('idle');
        morgan.setState('running');
        return true;
      }
    },
    3: function(morgan) {
      if (morgan.x > 320) {
        morgan.setState('jumping');
        return true;
      }
    },
    4: function(morgan) {
      if (morgan.x > 380) {
        morgan.setState('jumping');
        return true;
      }
    },
    5: function(morgan) {
      if (morgan.x > 440) {
        morgan.setState('running', {reverse: true});
        morgan.setState('jumping', {reverse: true});
        return true;
      }
    },
    6: function(morgan) {
      if (morgan.x < 380) {
        morgan.setState('running', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.x < 340) {
        morgan.setState('running');
        return true;
      }
    },
    8: function(morgan) {
      if (morgan.x > 380) {
        morgan.setState('jumping');
        return true;
      }
    },
    9: function(morgan) {
      if (morgan.x > 420) {
        morgan.setState('dashing');
        return true;
      }
    },
    10: function(morgan) {
      if (morgan.x > 600) {
        morgan.setState('running');
        morgan.setState('falling');
        return true;
      }
    },
    11: function(morgan) {
      if (morgan.y > 414) {
        morgan.setState('running');
        return true;
      }
    },
    12: function(morgan) {
      if (morgan.x > 760) {
        morgan.setState('jumping');
        return true;
      }
    },
    13: function(morgan) {
      if (morgan.x > 820) {
        morgan.setState('jumping');
        return true;
      }
    },
    14: function(morgan) {
      if (morgan.x > 860 && morgan.y > 369) {
        morgan.setState('running');
        return true;
      }
    },
    15: function(morgan) {
      if (morgan.x > 1000) {
        console.log('BLAM');
        return true;
      }
    },
    complete: {text: 'DONE!', x: 350, y: 340}
  };

  return sequences;
}

module.exports = DesignSequenceService;