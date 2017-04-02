
angular.module('app', [])
 
.controller('mainController', function($scope, $http) {
    $scope.formData = {};
    $http({
      method: 'GET',
      url: '/api/posts/latest'
    }).then(function successCallback(data) {
            $scope.modposts = data.data;
            console.log(data.data);
      }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

       
});