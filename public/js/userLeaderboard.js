angular.module('app', ['ngCookies'])

.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
  $scope.expertOffset = 0;
  $scope.currentSearchExperts = "";
  $scope.currentUserNum = 50;
  $scope.talkativeOffset = 0;
  $scope.favoritesOffset = 0;
  $scope.userFavorites = []

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

  $scope.changeTalk = function(){
    $scope.talkativePacket = {};
    $scope.talkativePacket.number = $scope.currentUserNum;
    if(!$scope.talkativePacket.number){
      $scope.talkativePacket.number = 50;
      $scope.currentUserNum = 50;
    }
    $scope.talkativeOffset = 0;
    $scope.talkativePacket.offset = $scope.talkativeOffset;
    console.log($scope.talkativePacket);
    $http({
        method: 'POST',
        url: '/api/talkative',
        data: $scope.talkativePacket
    }).then(function successCallback(data) {
            $scope.talkativeUsers = data.data;
            $scope.talkativeOffset += 25;
            if(data.data.length > 0){
              $("#loadMoreTalkative").show();
            }
            else{
              $("#loadMoreTalkative").hide();
            }
            console.log($scope.talkativeUsers);
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

  $scope.loadMoreTalkative = function(){
    $scope.talkativePacket.offset = $scope.talkativeOffset;
    console.log($scope.talkativePacket);
    $http({
        method: 'POST',
        url: '/api/talkative',
        data: $scope.talkativePacket
    }).then(function successCallback(data) {
      if(data.data.length > 0){
        $scope.talkativeUsers = $scope.talkativeUsers.concat(data.data);
        $scope.talkativeOffset += 25;
        console.log($scope.talkativeUsers);
      }
      else{
        $("#loadMoreTalkative").hide();
      }
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };

  $scope.loadMoreFavorties = function(){
    $http({
        method: 'GET',
        url: '/api/userFavoritesLeaderboard/' + $scope.favoritesOffset.toString()
    }).then(function successCallback(data) {
      if(data.data.length > 0){
        $scope.userFavorites = $scope.userFavorites.concat(data.data);
        $scope.favoritesOffset += 25;
        console.log($scope.userFavorites);
      }
      else{
        $("#loadMoreFavorites").hide();
      }
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };

  $scope.searchExperts();
  $scope.changeTalk();
  $scope.loadMoreFavorties();

}]);
