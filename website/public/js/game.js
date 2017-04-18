var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var title = getUrlParameter('name');
var year = getUrlParameter('year');

angular.module('app', ['ngCookies'])
.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {

$scope.packetToSend = {};
$scope.packetToSend.game_name = title;
$scope.packetToSend.releaseyear = year;

  $http({
        method: 'POST',
        url: '/api/gameinfo',
        data: $scope.packetToSend
      }).then(function successCallback(data) {
          if(data.data.length > 0){
            $scope.game_name = data.data[0].name;
            $scope.releaseyear = data.data[0].releaseyear;
            $scope.genre = data.data[0].genre;
            $scope.description = data.data[0].description;
          }
          else{
            $window.location.href = "/404.html";
          }

        }, function errorCallback(data) {
              $window.location.href = "/404.html";

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

  $http({
        method: 'POST',
        url: '/api/topPostsForAGame',
        data: $scope.packetToSend
      }).then(function successCallback(data) {
        $scope.topPosts = data.data;
        }, function errorCallback(data) {

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

  $http({
        method: 'POST',
        url: '/api/noTypeModsForAGame',
        data: $scope.packetToSend
      }).then(function successCallback(data) {
        $scope.noType = data.data;
        }, function errorCallback(data) {

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

  $http({
        method: 'POST',
        url: '/api/addOnModsForGame',
        data: $scope.packetToSend
      }).then(function successCallback(data) {
        $scope.addOnMod = data.data;
        }, function errorCallback(data) {

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

  $http({
        method: 'POST',
        url: '/api/graphicalModsForAGame',
        data: $scope.packetToSend
      }).then(function successCallback(data) {
        $scope.graphical = data.data;
        }, function errorCallback(data) {

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

  $http({
        method: 'POST',
        url: '/api/unofficialPatchModsForAGame',
        data: $scope.packetToSend
      }).then(function successCallback(data) {
        $scope.patchMods = data.data;
        }, function errorCallback(data) {

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

}]);
