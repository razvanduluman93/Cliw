'use strict';

angular.module('appApp')
  .controller('ConverterCtrl', function($scope, $http, API_URL,alert) {
    
    $http.get("https://bitpay.com/api/rates")
      .success(function(data){
        $scope.rates = data;
        for(var i=0;i<data.length;i++){
          if (data[i].code == "USD"){
            $scope.currRate = data[i].rate;
          }
        }
        $scope.initalAmt  = 5000;
        $scope.currMoney = function(price){return price*$scope.currRate;}
        $scope.newAmt     = function(price){return price/$scope.currRate * $scope.initalAmt;}
        $scope.profit     = function(price){return price/$scope.currRate * $scope.initalAmt - $scope.initalAmt;}
    
    }).error(function(err){
        alert('warning', "Unable to get coins", err.message);
    })
})
    
