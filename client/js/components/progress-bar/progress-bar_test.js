'use strict';

describe('progressBar', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function ($rootScope, _$compile_) {
    that.$compile = _$compile_;
    that.scope = $rootScope.$new();

    that.element = angular.element('<progress-bar title="\'pants\'" bar-min="0" bar-max="100" current="50"></progress-bar>');
    that.compiled = that.$compile(that.element);
  }));

  describe('elements', function() {
    beforeEach(function() {
      that.element = that.compiled(that.scope);
      that.scope.$digest();
    });

    it('renders the correct number of jars', function() {
      expect(that.element[0].querySelectorAll('.progress-bar-jar')).to.have.length(10);
    });

    it('renders the title', function() {
      expect(that.element[0].querySelector('.progress-bar-title').innerHTML).to.match(/pants/);
    });
  });
});