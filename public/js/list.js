
angular.module('app', [])
 
.controller('mainController', function($scope, $http) {
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

});