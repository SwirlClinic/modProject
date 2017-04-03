
angular.module('app', ['ngCookies'])
 
.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
    //$(".userInfo").hide();
    $scope.userInfo = [];

    var myUser = $cookies.get('access_token');

    if (myUser != null) {

        $http({
              method: 'GET',
              url: '/api/getfollowmods/' + myUser
            }).then(function successCallback(data) {
                console.log(data.data);
                $scope.modposts = data.data;
              }, function errorCallback(data) {
                    console.log(data);

                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
    }


}]);