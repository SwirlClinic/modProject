
angular.module('app', ['ngCookies'])
 
.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {

    var myUser = $cookies.get('access_token');

    $scope.errorlogin = false;

    if (myUser == null) {
        $scope.errorlogin = true;
    }

    var gameSelected = "";

    $scope.modsAdded = [];

    $(".modsSelected").hide();

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

    $scope.savePost = function(data) {

        for(var i = 0; i < $scope.games.length; i++) {
            if ($scope.games[i].name == gameSelected) {
                data.gameinfo = $scope.games[i];
                break;
            }
        }

        
        $http({
            method: 'POST',
            url: '/api/submitmod',
            data: data
        }).then(function successCallback(data) {
            
            if (data.data.message != "Failure!") {
                console.log('Success! Saved ' + data);
                $scope.successpost = true;
                $scope.submiterror = false;
            }
            else {

                console.log('it didnt work!');
                $scope.successpost = false;
                $scope.submiterror = true;
            }
            
        }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
    };

    $( ".gameSelect" ).change(function() {
        gameSelected = this.value;
    });

}]);