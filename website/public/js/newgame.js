angular.module('app',['ngCookies'])
.controller('mainController',['$scope','$http','$cookies','$window',function($scope,$http,$cookies,$window){
  var myUser = $cookies.get('access_token');

  $scope.errorlogin = false;

  if (myUser == null) {
      $scope.errorlogin = true;
  }

  $scope.saveGame = function(data){
    $http({
      method: 'POST',
      url: '/api/submitGame',
      data: data
    }).then(function successCallback(data){

      if (data.data.message != "Failure!") {
          console.log('Success! Saved ' + data);
          $scope.successpost = true;
          $scope.submiterror = false;
      }

      else {
          console.log('it didnt work!');
          $scope.successpost = false;
          $scope.submiterror = true;
      }

    }, function errorCallback(data){

    });
  };

}]);
