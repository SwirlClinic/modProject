
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var username = getUrlParameter('username');

angular.module('app', ['ngCookies']).controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
  if(username){

    var myUser = $cookies.get('access_token');

    $scope.errorlogin = false;

    if (myUser == null) {
        $scope.errorlogin = true;
    }

    $scope.assignButton = function(){
      if($scope.follows === true){
        $scope.followingButtonText = "Unfollow";
      }
      else{
        $scope.followingButtonText = "Follow";
      }
    };

    $scope.follows = false;

    $http({
          method: 'GET',
          url: '/api/users/' + username
        }).then(function successCallback(data) {
            if(data.data.length > 0){
              $scope.username = data.data[0].username;
              $scope.email = data.data[0].email;

              if(!$scope.errorlogin){
                var checkFollows = {};
                checkFollows.follower = myUser;
                checkFollows.is_followed = $scope.username;
                $http({
                  method: 'POST',
                  url: '/api/doesFollow',
                  data: checkFollows
                }).then(function anotherSuccess(returnData){
                  $scope.follows = returnData.data[0].result;
                  console.log($scope.follows);
                  $scope.assignButton();
                }, function error(errorData){
                  console.log(errorData);
                  $scope.assignButton();
                });
              }
              else{
                $scope.assignButton();
              }

            }
            else{
              $window.location.href = "/404.html";
            }

          }, function errorCallback(data) {
                $window.location.href = "/404.html";

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    $http({
          method: 'GET',
          url: '/api/postsWrittenBy/' + username
        }).then(function successCallback(data) {
              $scope.postsByUser = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });


    $http({
          method: 'GET',
          url: '/api/favorites/' + username
        }).then(function successCallback(data) {
              $scope.favoritesByUser = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting favorite posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    $http({
          method: 'GET',
          url: '/api/following/' + username
        }).then(function successCallback(data) {
              $scope.following = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting favorite posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });


    $http({
          method: 'GET',
          url: '/api/followers/' + username
        }).then(function successCallback(data) {
              $scope.followers = data.data;
          }, function errorCallback(data) {
                console.log("Issue getting favorite posts.");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });



          $http({
                method: 'GET',
                url: '/api/followingCount/' + username
              }).then(function successCallback(data) {
                    $scope.followingCount = data.data[0].count;
                }, function errorCallback(data) {
                      console.log("Issue getting following count posts.");

                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });

          $http({
                method: 'GET',
                url: '/api/followersCount/' + username
              }).then(function successCallback(data) {
                    $scope.followersCount = data.data[0].count;
                }, function errorCallback(data) {
                      console.log("Issue getting follower count posts.");

                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });

          $http({
            method: 'GET',
            url: '/api/postsVisited/' + username
          }).then(function successCallback(data) {
            $scope.visitedPostsByUser = data.data;
          }, function errorCallback(data) {
            console.log("Issue getting favorite posts.");
          });

          $scope.onClickFollowButton = function(){
            if($scope.errorlogin){
              $.notify('You need to login in order to follow a user','error');
            }
            else{
              if($scope.follows){
                urlForPost = '/api/unfollow'
              }
              else{
                urlForPost = '/api/follow'
              }
              var followsPost = {};
              followsPost.follower = myUser;
              followsPost.is_followed = $scope.username;
              $http({
                  method: 'POST',
                  url: urlForPost,
                  data: followsPost
              }).then(function successCallback(returnData) {
                  if (returnData.data.message != "Failure!") {
                      $scope.follows = !$scope.follows;
                      if($scope.follows){
                        $.notify("You are now following "+$scope.username,'success');
                        $scope.followersCount = parseInt($scope.followersCount) + 1;
                        $scope.followers.push({'follower': myUser});
                      }
                      else{
                        $.notify("You have unfollowed "+$scope.username,'success');
                        $scope.followersCount = parseInt($scope.followersCount) - 1;
                        $scope.followers.splice($scope.followers.indexOf({'follower': myUser}),1);
                      }
                      $scope.assignButton();
                  }
                  else{
                      $.notify("There was an issue with following. Try reloading the page and trying again.",'error');
                  }
            }, function errorOccurred(errorData){
              $.notify("There was an issue with following. Try reloading the page and trying again.",'error');
            })
          }
        };

  }
  else{
    $window.location.href = "/404.html";
  }
}]);
