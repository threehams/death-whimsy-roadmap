'use strict';

function DesignSequenceService() {
  var sequences = {};
  sequences[0] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 112
  };

  sequences[10] = {
    1: function(morgan) {
      if (morgan.x > 135) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
        morgan.setState('idle');
        morgan.setState('running');
        return true;
      }
    },
    3: function(morgan) {
      if (morgan.x > 390) {
        morgan.setState('jumping');
        return true;
      }
    },
    4: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 195
  };

  sequences[20] = {
    1: function(morgan) {
      if (morgan.x > 135) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 398) {
        morgan.setState('idle');
        morgan.setState('running');
        return true;
      }
    },
    3: function(morgan) {
      if (morgan.x > 391) {
        morgan.setState('jumping');
        return true;
      }
    },
    4: function(morgan) {
      if (morgan.x > 458 && morgan.y > 347) {
        morgan.setState('idle');
        morgan.setState('running');
        return true;
      }
    },
    5: function(morgan) {
      if (morgan.x > 620) {
        morgan.setState('jumping');
        return true;
      }
    },
    6: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 275
  };

  sequences[30] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
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
      if (morgan.x > 400) {
        morgan.setState('jumping');
        return true;
      }
    },
    5: function(morgan) {
      if (morgan.x > 440) {
        morgan.setState('idle');
        morgan.setState('falling');
        return true;
      }
    },
    6: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 197
  };

  sequences[40] = {
    1: function(morgan) {
      if (morgan.x > 120) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
        morgan.setState('idle');
        morgan.setState('running');
        return true;
      }
    },
    3: function(morgan) {
      if (morgan.x > 390) {
        morgan.setState('jumping');
        return true;
      }
    },
    4: function(morgan) {
      if (morgan.x > 440) {
        morgan.setState('running', {reverse: true});
        morgan.setState('jumping', {reverse: true});
        return true;
      }
    },
    5: function(morgan) {
      if (morgan.x < 400) {
        morgan.setState('hurting', {reverse: true});
        return true;
      }
    },
    6: function(morgan) {
      if (morgan.x > 440) {
        morgan.setState('idle', {reverse: true});
        morgan.setState('falling', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 229
  };

  sequences[50] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
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
      if (morgan.x < 400) {
        morgan.setState('dashing', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.x < 230) {
        morgan.setState('running', {reverse: true});
        morgan.setState('falling', {reverse: true});
        return true;
      }
    },
    8: function(morgan) {
      if (morgan.x < 150) {
        morgan.setState('idle', {reverse: true});
        morgan.setState('falling', {reverse: true});
        return true;
      }
    },
    9: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 239
  };

  sequences[60] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
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
      if (morgan.x < 365) {
        morgan.setState('running', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.x < 320) {
        morgan.setState('running');
        return true;
      }
    },
    8: function(morgan) {
      if (morgan.x > 375) {
        morgan.setState('jumping');
        return true;
      }
    },
    9: function(morgan) {
      if (morgan.x > 450 && morgan.y > 260) {
        morgan.setState('running');
        return true;
      }
    },
    10: function(morgan) {
      if (morgan.x > 550) {
        morgan.setState('jumping');
        return true;
      }
    },
    11: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 339
  };

  sequences[70] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
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
      if (morgan.x < 365) {
        morgan.setState('running', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.x < 320) {
        morgan.setState('running');
        return true;
      }
    },
    8: function(morgan) {
      if (morgan.x > 375) {
        morgan.setState('jumping');
        return true;
      }
    },
    9: function(morgan) {
      if (morgan.x > 415) {
        morgan.setState('dashing');
        return true;
      }
    },
    10: function(morgan) {
      if (morgan.x > 550) {
        morgan.setState('running');
        morgan.setState('falling');
        return true;
      }
    },
    11: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 284
  };

  sequences[80] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
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
      if (morgan.x < 365) {
        morgan.setState('running', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.x < 320) {
        morgan.setState('running');
        return true;
      }
    },
    8: function(morgan) {
      if (morgan.x > 375) {
        morgan.setState('jumping');
        return true;
      }
    },
    9: function(morgan) {
      if (morgan.x > 415) {
        morgan.setState('dashing');
        return true;
      }
    },
    10: function(morgan) {
      if (morgan.x > 515) {
        morgan.setState('hurting');
        return true;
      }
    },
    11: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 291
  };

  sequences[90] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
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
      if (morgan.x < 385) {
        morgan.setState('running', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.x < 320) {
        morgan.setState('running');
        return true;
      }
    },
    8: function(morgan) {
      if (morgan.x > 375) {
        morgan.setState('jumping');
        return true;
      }
    },
    9: function(morgan) {
      if (morgan.x > 415) {
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
      if (morgan.y > 389) {
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
      if (morgan.x > 835) {
        morgan.setState('jumping');
        return true;
      }
    },
    14: function(morgan) {
      if (morgan.x > 860) {
        morgan.setState('hurting');
        return true;
      }
    },
    15: function(morgan) {
      if (morgan.y > 580) {
        return true;
      }
    },
    frames: 370
  };

  sequences[100] = {
    1: function(morgan) {
      if (morgan.x > 130) {
        morgan.setState('jumping');
        return true;
      }
    },
    2: function(morgan) {
      if (morgan.y > 393) {
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
      if (morgan.x < 385) {
        morgan.setState('running', {reverse: true});
        return true;
      }
    },
    7: function(morgan) {
      if (morgan.x < 320) {
        morgan.setState('running');
        return true;
      }
    },
    8: function(morgan) {
      if (morgan.x > 375) {
        morgan.setState('jumping');
        return true;
      }
    },
    9: function(morgan) {
      if (morgan.x > 415) {
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
      if (morgan.y > 389) {
        morgan.setState('running');
        return true;
      }
    },
    12: function(morgan) {
      if (morgan.x > 830) {
        morgan.setState('jumping');
        return true;
      }
    },
    13: function(morgan) {
      if (morgan.x > 860 && morgan.y > 344) {
        morgan.setState('running');
        return true;
      }
    },
    14: function(morgan) {
      if (morgan.x > 1000) {
        return true;
      }
    },
    frames: 375
  };

  return sequences;
}

module.exports = DesignSequenceService;