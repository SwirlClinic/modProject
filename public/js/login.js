
angular.module('app', [])
 
.controller('mainController', function($scope, $http) {
    $scope.login = function(user) {

        $http({
              method: 'POST',
              url: '/api/login',
              data: user
            }).then(function successCallback(data) {

                    console.log(data.data);


                    if (data.data.message == "Success!") {
                        console.log("We did it reddit!");
                    }
                    else {
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

});