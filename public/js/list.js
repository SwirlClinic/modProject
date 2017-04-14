
angular.module('app', ['ngCookies'])

.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {

    var myUser = $cookies.get('access_token');

    $scope.errorlogin = false;

    if (myUser == null) {
        $scope.errorlogin = true;
    }

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

        var data = {};
        if(!$scope.postTitle || $scope.postTitle.trim() == ""){
          $.notify("Please enter a title in order to post.",'error');
          return;
        }
        data.title = $scope.postTitle;
        if(!$scope.postBody || $scope.postBody.trim() == ""){
          $.notify("Please add a body to the post.",'error');
          return;
        }
        data.body = $scope.postBody;
        data.gameinfo = $scope.gameChosen;
        if(!$scope.gameChosen){
          $.notify("Please choose a game in order to post.",'error');
          return;
        }

        data.username = myUser;
        data.modsAdded = $scope.modsAdded;
        if(!($scope.modsAdded.length > 0)){
          $.notify("Each post needs to have at least one mod.",'error');
          return;
        }
        console.log(data);

        $http({
            method: 'POST',
            url: '/api/submitpost',
            data: data
        }).then(function successCallback(data) {
            if (data.data.message != "Failed!") {
                console.log('Success! Saved ' + data);
                $.notify("Your post " + $scope.postTitle + " was successfully made!",'success');
            }
            else {
              $.notify("Your post was not made. There was an error on the server end or some incorrect input. Please try again.",'error');
            }

        }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $.notify("Your post was not made. There was an error on the server end. Please try again.",'error');
        });
    };

    $scope.gameSelectChange = function() {
        $scope.modsAdded = [];
        $scope.current_game_name = this.gameChosen.name;
        $scope.current_game_year = this.gameChosen.releaseyear;

        var gamePacket = {};
        gamePacket.game_name = $scope.current_game_name;
        gamePacket.game_release_year = $scope.current_game_year;

        if (gamePacket.game_name && gamePacket.game_release_year) {
            $http({
              method: 'POST',
              url: '/api/modfor',
              data: gamePacket
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

    };

    $scope.modSelectChange = function() {
        if ($scope.current_game_name && $scope.current_game_year && $scope.modSelected !== null) {
            $scope.modsAdded.push($scope.modSelected);
            for (var i = 0; i < $scope.modsForGame.length; i++) {
                if ($scope.modsForGame[i].modid == $scope.modSelected.modid) {
                    $scope.modsForGame.splice(i,1);
                    break;
                }
            }
        }



        //console.log(this.value);
    };

}]);
