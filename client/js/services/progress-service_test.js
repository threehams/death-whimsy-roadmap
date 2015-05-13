'use strict';

describe('ProgressService', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function (_ProgressService_, _$httpBackend_) {
    that.ProgressService = _ProgressService_;
    that.$httpBackend = _$httpBackend_;
  }));

  it('calls the progress route', function() {
    that.$httpBackend.expectGET('/api/progress').respond({progress: 100});
    that.ProgressService.index().then(function(data) {
      expect(data).to.eql({progress: 100});
    });
    that.$httpBackend.flush();
  });
});