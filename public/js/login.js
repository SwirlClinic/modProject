
angular.module('app', ['ngCookies'])
 
.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
    //$(".userInfo").hide();
    $scope.userInfo = [];

    var myUser = $cookies.get('access_token');

    if (myUser != null) {
        $(".login").hide();
        $(".userInfo").show();

        $scope.userInfo.push(myUser);
        console.log($scope.userInfo);
    }

    $scope.logout = function() {
        $http({
              method: 'GET',
              url: '/api/logout'
            }).then(function successCallback(data) {
                $window.location.href = '/login.html';
              }, function errorCallback(data) {
                    console.log(data);

                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
    };

    $scope.login = function(user) {

        $http({
              method: 'POST',
              url: '/api/login',
              data: user
            }).then(function successCallback(data) {

                    console.log(data.data);


                    if (data.data.message == "Success!") {
                        console.log("We did it reddit!");
                        $window.location.href = '/login.html';
                    }
                    else {
                        $scope.errorlogin = true;
                        console.log("Mission failed, we'll get them next time.");
                    }
/*                    if (data.data[0].password.trim() === user.password) {
                        console.log("Success!");
                    }
                    else {
                        console.log("Auth error!");
                    }*/

                    //console.log(data.data);
              }, function errorCallback(data) {
                    console.log(data);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });



    };

}]);