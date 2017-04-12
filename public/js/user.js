
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

var username = getUrlParameter('username');

angular.module('app', ['ngCookies']).controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
  if(username){

    $http({
          method: 'GET',
          url: '/api/users/' + username
        }).then(function successCallback(data) {
            if(data.data.length > 0){
              $scope.username = data.data[0].username;
              $scope.email = data.data[0].email;
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
          method: 'GET',
          url: '/api/postsWrittenBy/' + username
        }).then(function successCallback(data) {
              $scope.postsByUser = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });


    $http({
          method: 'GET',
          url: '/api/favorites/' + username
        }).then(function successCallback(data) {
              $scope.favoritesByUser = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting favorite posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    $http({
          method: 'GET',
          url: '/api/following/' + username
        }).then(function successCallback(data) {
              $scope.following = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting favorite posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });


    $http({
          method: 'GET',
          url: '/api/followers/' + username
        }).then(function successCallback(data) {
              $scope.followers = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting favorite posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

  }
  else{
    $window.location.href = "/404.html";
  }
}]);
