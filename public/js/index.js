
angular.module('app', [])
 
.controller('mainController', function($scope, $http) {
    $scope.formData = {};
    $http({
      method: 'GET',
      url: '/api/users'
    }).then(function successCallback(data) {
            $scope.bears = data.data;
            console.log(data.data);
      }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    $scope.saveBear = function(user) {

        $http({
            method: 'POST',
            url: '/api/users',
            data: user
        }).then(function successCallback(data) {
            console.log('Success! Saved ' + data);
            $scope.bears.push(user);
        }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
    };

       
});