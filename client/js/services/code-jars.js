'use strict';

// Coordinates for the jars. Since some are stacked, fill in the bottom ones first, then the top.
// Fill out the left before the right, to make progress easier to see.
// TODO May want to split this into four section to make progress clearer day-to-day.
var row1left = _.shuffle([
  [16, 195], [64, 194], [134, 196], [180, 197],
  [19, 311], [69, 315], [130, 317], [181, 320], [243, 324], [303, 327],
  [134, 453], [182, 453], [249, 455], [304, 454], [374, 454], [421, 455],
  [181, 544], [247, 545], [303, 544], [376, 546], [421, 546]
]);
var row2left = _.shuffle([
  [9, 151], [70, 149], [158, 149],
  [66, 269], [148, 273],
  [137, 409], [184, 409], [276, 409], [373, 407]
  // no row2 jars on bottom row
]);

var row1right = _.shuffle([
  [813, 187], [862, 189], [933, 190],
  [660, 345], [725, 341], [774, 340], [820, 336], [932, 332], [865, 335],
  [598, 455], [659, 454], [734, 454], [784, 454], [929, 452],
  [601, 546], [650, 545], [728, 545], [777, 546], [830, 544], [931, 545]
]);
var row2right = _.shuffle([
  [863, 145], [935, 145],
  [816, 292], [865, 292], [932, 286],
  [660, 403], [738, 403], [791, 403], [937, 406]
  // no row2 jars on bottom row
]);

module.exports = row1left.concat(row2left).concat(row1right).concat(row2right);
