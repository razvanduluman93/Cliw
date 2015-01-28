'use strict';

angular.module('appApp')
  .service('alert', function alert($rootScope,$timeout) {
    return function(type,title,message,timeout){
        var alertTimeout;
        $rootScope.alert={
            hasBeenShow: true,
            show: true,
            type: type,
            message: message,
            title: title  
        };
        $timeout.cancel(alertTimeout);
        alertTimeout = $timeout(function(){
            $rootScope.alert.show=false;
        },timeout || 2000);
    }
  });
