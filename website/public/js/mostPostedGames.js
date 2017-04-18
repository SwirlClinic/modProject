angular.module('app', ['ngCookies'])

.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
  $scope.genres = [];

  $scope.currentURL = '/api/mostPostedAboutGames';
  $scope.currentOffset = 0;

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
      method: 'POST',
      url: '/api/mostPostedAboutGames',
      data: {'offset' : $scope.currentOffset}
  }).then(function successCallback(data) {
          $scope.mostPostedAbout = data.data;
          $scope.currentOffset += 25;
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
    $scope.currentURL = newUrl;
    $scope.currentOffset = 0;
    $http({
        method: 'POST',
        url: newUrl,
        data: {'offset' : $scope.currentOffset}
    }).then(function successCallback(data) {
            $scope.mostPostedAbout = data.data;
            $scope.currentOffset += 25;
            console.log($scope.mostPostedAbout);
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };

  $scope.loadMore = function(){
    $http({
        method: 'POST',
        url: $scope.currentURL,
        data: {'offset' : $scope.currentOffset}
    }).then(function successCallback(data) {
            $scope.mostPostedAbout = $scope.mostPostedAbout.concat(data.data);
            $scope.currentOffset += 25;
            console.log($scope.mostPostedAbout);
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };


}]);
