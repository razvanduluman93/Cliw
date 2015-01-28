'use strict';


angular.module('appApp')
  .controller('RegisterCtrl', function($scope, alert, auth) {
    $scope.submit = function() {
      auth.register($scope.email, $scope.password)
        .success(function(response) {
          alert('success', 'Account Created!', ' Welcome, ' + response.user.email + '!');
        })
        .error(function(err) {
          alert('warning', 'Something went wrong', err.message);
        });
    }
  });
