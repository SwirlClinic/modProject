angular.module('app', ['ngCookies'])

.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
  $scope.expertOffset = 0;
  $scope.currentSearchExperts = "";

  $scope.searchExperts = function(){
    $scope.packetToSend = {};
    $scope.packetToSend.name = $scope.currentSearchExperts;
    $scope.expertOffset = 0;
    $scope.packetToSend.offset = $scope.expertOffset;
    console.log($scope.packetToSend);
    $http({
        method: 'POST',
        url: '/api/experts',
        data: $scope.packetToSend
    }).then(function successCallback(data) {
            $scope.userExperts = data.data;
            $scope.expertOffset += 25;
            if(data.data.length > 0){
              $("#loadMoreExperts").show();
            }
            else{
              $("#loadMoreExperts").hide();
            }
            console.log($scope.userExperts);
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };

  $scope.loadMoreExperts = function(){
    $scope.packetToSend.offset = $scope.expertOffset;
    console.log($scope.packetToSend);
    $http({
        method: 'POST',
        url: '/api/experts',
        data: $scope.packetToSend
    }).then(function successCallback(data) {
      if(data.data.length > 0){
        $scope.userExperts = $scope.userExperts.concat(data.data);
        $scope.expertOffset += 25;
        console.log($scope.userExperts);
      }
      else{
        $("#loadMoreExperts").hide();
      }
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };

  $scope.searchExperts();

}]);
