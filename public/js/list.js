
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

        data.username = myUser;
        data.modsAdded = $scope.modsAdded;
        console.log(data);

        $http({
            method: 'POST',
            url: '/api/submitpost',
            data: data
        }).then(function successCallback(data) {
            if (data.data.message != "Failed!") {
                console.log('Success! Saved ' + data);
                $scope.successpost = true;
            }
            else {
                $scope.successpost = false;
            }

        }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
    };

    $( ".gameSelect" ).change(function() {
        $scope.modsAdded = [];
        gameSelected = this.value;

        if (gameSelected) {
            $http({
              method: 'GET',
              url: '/api/modfor/' + gameSelected
            }).then(function successCallback(data) {
                    //console.log(data.data);

                    $scope.modsForGame = data.data;

                    //console.log(data.data);
              }, function errorCallback(data) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });

            $(".modsSelected").show();
        }
        else {
            $(".modsSelected").hide();
        }

    });

    $( ".modSelect" ).change(function() {

        if (gameSelected) {
            for (var i = 0; i < $scope.modsForGame.length; i++) {
                if ($scope.modsForGame[i].name == this.value) {
                    $scope.modsAdded.push($scope.modsForGame[i]);
                    $scope.modsForGame.splice(i,1);
                    break;
                }
            }
        }



        //console.log(this.value);
    });

}]);
