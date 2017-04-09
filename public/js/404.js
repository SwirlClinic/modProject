angular.module('app',['ngCookies'])
.controller('mainController',['$scope','$http','$cookies','$window',function($scope,$http,$cookies,$window){
  var myUser = $cookies.get('access_token');

  $scope.errorlogin = false;

  if (myUser == null) {
      $scope.errorlogin = true;
  }

}]);
