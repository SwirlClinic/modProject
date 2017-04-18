
angular.module('app', ['ngCookies'])

.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
    //$(".userInfo").hide();
    $scope.userInfo = [];

    var myUser = $cookies.get('access_token');

    if (myUser != null) {
      $scope.initialOffset = 10;

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

        $scope.onClickLoadMore = function(){
          $http({
            method: 'GET',
            url: '/api/getfollowmods/' + myUser + "/" + $scope.initialOffset.toString()
          }).then(function successCallback(data) {
                  if(data.data.length > 0){
                    $scope.modposts = $scope.modposts.concat(data.data);
                    console.log(data.data);
                    $scope.initialOffset += 10;
                  }
                  else{
                    $("#loadMore").hide();
                  }
            }, function errorCallback(data) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        };
    }

    else{
      $("#loadMore").hide();
    }


}]);
