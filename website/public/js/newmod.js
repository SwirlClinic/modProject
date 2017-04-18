
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

    $scope.savePost = function() {
        var dataPacket = {};

        if(!$scope.gameChosen){
          $.notify("Please choose a game in order to post.",'error');
          return;
        }
        dataPacket.gameinfo = $scope.gameChosen;

        if(!$scope.modPost ||!$scope.modPost.name || $scope.modPost.name.trim() == ""){
          $.notify("Please enter a mod Name in order to post.",'error');
          return;
        }
        dataPacket.name = $scope.modPost.name;

        if(!$scope.modPost.link || $scope.modPost.link.trim() == ""){
          $.notify("Please enter a mod link in order to post.",'error');
          return;
        }
        dataPacket.link = $scope.modPost.link;

        if(!$scope.modPost.description || $scope.modPost.description.trim() == ""){
          $.notify("Please enter a description in order to post.",'error');
          return;
        }
        dataPacket.description = $scope.modPost.description

        dataPacket.type = $scope.modType;

        if($scope.modType == 'addon'){
          dataPacket.hoursAdded = parseInt($scope.hoursAdded, 10);
          dataPacket.numNewItems = parseInt($scope.numNewItems, 10);
          if(isNaN(dataPacket.hoursAdded) || isNaN(dataPacket.numNewItems)){
            $.notify("Please fill out fields for add-on mod in order to post an add-on mod.",'error');
            return;
          }
        }
        else if($scope.modType == 'graph'){
          dataPacket.resolution = $scope.resolution
          dataPacket.fps = parseInt($scope.fps,10)
          if(!dataPacket.resolution || isNaN(dataPacket.fps)){
            $.notify("Please fill out fields for graphical mod in order to post a graphical mod.",'error');
            return;
          }
        }
        else if($scope.modType == 'un'){
          dataPacket.versionNum = $scope.versionNum;
          if(!dataPacket.versionNum){
            $.notify("Please fill out fields for an un-official patch mod in order to post an un-official patch mod.",'error');
            return;
          }
        }

        console.log(dataPacket)


        $http({
            method: 'POST',
            url: '/api/submitmod',
            data: dataPacket
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


}]);
