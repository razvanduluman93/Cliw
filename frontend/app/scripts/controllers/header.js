'use strict';

angular.module('appApp')
  .controller('headerCtrl', function ($scope, authToken) {
    $scope.isAuthentificated = authToken.isAuthentificated;
  });
