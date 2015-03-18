'use strict';

describe('ProgressService', function() {
  var that = this;

  beforeEach(angular.mock.module('SampleApp'));
  beforeEach(inject(function (_ProgressService_) {
    that.ProgressService = _ProgressService_;
  }));

  it('fails', function() {
    expect(true).to.be.false;
  });
});