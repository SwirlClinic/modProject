
angular.module('app', [])
 
.controller('mainController', function($scope, $http) {
    $http({
      method: 'GET',
      url: '/api/games'
    }).then(function successCallback(data) {
            $scope.games = data.data;
            console.log(data.data);
      }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    $scope.savePost = function(user) {

        console.log(user);

        console.log($scope.games);

/*        $http({
            method: 'POST',
            url: '/api/users',
            data: user
        }).then(function successCallback(data) {
            console.log('Success! Saved ' + data);
            $scope.games.push(user);
        }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });*/
    };


});