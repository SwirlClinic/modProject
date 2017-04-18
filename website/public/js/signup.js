
angular.module('app', [])
 
.controller('mainController', function($scope, $http) {
    $scope.formData = {};

    $scope.saveBear = function(user) {

        $http({
            method: 'POST',
            url: '/api/users',
            data: user
        }).then(function successCallback(data) {
            if (data.data.message == "Success!") {
                        console.log("We did it reddit!");
                        $scope.errorlogin = true;
            }
            else {
                
                console.log("Mission failed, we'll get them next time.");
            }
            console.log('Success! Saved ' + data);
        }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
    };

       
});