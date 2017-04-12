angular.module('app', ['ngCookies'])

.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
  $scope.genres = [];

  $http({
      method: 'GET',
      url: '/api/genres'
  }).then(function successCallback(data) {
          $scope.genres = data.data;
          console.log($scope.genres);
  }, function errorCallback(data) {
  // called asynchronously if an error occurs
  // or server returns response with an error status.
  });

  $http({
      method: 'GET',
      url: '/api/mostPostedAboutGames'
  }).then(function successCallback(data) {
          $scope.mostPostedAbout = data.data;
          console.log($scope.mostPostedAbout);
  }, function errorCallback(data) {
  // called asynchronously if an error occurs
  // or server returns response with an error status.
  });

  $scope.onSelectChange = function(){
    newUrl = '/api/mostPostedAboutGames/';
    if($scope.select.genre.trim() != ""){
      newUrl += $scope.select.genre;
    }
    $http({
        method: 'GET',
        url: newUrl
    }).then(function successCallback(data) {
            $scope.mostPostedAbout = data.data;
            console.log($scope.mostPostedAbout);
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  }


}]);
