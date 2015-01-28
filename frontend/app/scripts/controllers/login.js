'use strict';

angular.module('appApp').controller('LoginCtrl', function($scope, alert, auth) {
    $scope.submit = function() {

     
      auth.login($scope.email, $scope.password)
        .success(function(response) {
          alert('success', 'Welcome', ' Thanks for coming back, ' + response.user.email + '!');
        })
        .error(function(err) {
          alert('warning', 'Something went wrong');
        });
    };
    
    $scope.google = function() {
        auth.googleAuth().then(function(response){
            alert('success', 'Welcome', ' Thanks for coming back, ' + response.user.displayName + '!');
        },handleError);
    }
    
    function handleError(err){
          alert('warning', 'Something went wrong', err.message);
        }
    
  });
