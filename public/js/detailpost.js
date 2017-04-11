
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

var title = getUrlParameter('title');
var time = getUrlParameter('time');
var date = getUrlParameter('date');

angular.module('app', ['ngCookies'])

.controller('mainController', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {

    var postinfo = {};
    postinfo.title = title;
    postinfo.time = time;
    postinfo.date = date;
    //console.log(postinfo);

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

    $scope.assignFavoritesButton = function(){
      if($scope.favorites === true){
        $scope.favoritesButtonText = "Unfavorite";
      }
      else{
        $scope.favoritesButtonText = "Favorite";
      }
    };

    $scope.follows = false;
    $scope.favorites = false;
    $scope.modinfo = [postinfo];

        $http({
              method: 'POST',
              url: '/api/posts/details',
              data: postinfo
            }).then(function successCallback(data) {
                if(data.data.length > 0){
                  console.log(data.data);
                  $scope.modposts = data.data;
                }
                else{
                  $window.location.href = "/404.html";
                }
              }, function errorCallback(data) {
                    console.log(data);

                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });

        if(!$scope.errorlogin){
          var favoriteCheck = {}
          favoriteCheck.title = title;
          favoriteCheck.time = time;
          favoriteCheck.date = date;
          favoriteCheck.username = myUser;
          console.log(favoriteCheck);
          $http({
            method: 'POST',
            url: '/api/doesFavorite',
            data: favoriteCheck
          }).then(function successCallback(data){
            $scope.favorites = data.data[0].result;
            $scope.assignFavoritesButton();
          }, function errorCallback(data){
            $scope.assignFavoritesButton();
          });
        }
        else{
          $scope.assignFavoritesButton();
        }


        $http({
              method: 'POST',
              url: '/api/posts/mainPostContent',
              data: postinfo
            }).then(function successCallback(data) {
                if(data.data.length > 0){
                  console.log(data.data);
                  $scope.postMainContent = data.data;

                  if(!$scope.errorlogin){
                    var checkFollows = {};
                    checkFollows.follower = myUser;
                    checkFollows.is_followed = $scope.postMainContent[0].username;
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
                    console.log(data);
                    $scope.assignButton();

                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });

        var getComments = {};
        getComments.post_title = title;
        getComments.post_time = time;
        getComments.post_date = date;
        $http({
              method: 'POST',
              url: '/api/comments',
              data: getComments
            }).then(function successCallback(data) {
                  console.log(data.data);
                  $scope.comments = data.data;
              }, function errorCallback(data) {
                    console.log(data);

                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });

        $scope.postComment = function(data){
          if($scope.errorlogin){
            $.notify('You need to login in order to post','error');
          }
          else if(data.comment_body.trim() === "" ){
            $.notify('Comment needs to have actual content in order to post','error');
          }
          else{
            data.username = myUser;
            data.post_title = title;
            data.post_time = time;
            data.post_date = date;

            $http({
                method: 'POST',
                url: '/api/makeComment',
                data: data
            }).then(function successCallback(returnData) {
                if (returnData.data.message != "Failure!") {
                    $.notify("Your comment was successfully posted.",'success');
                    commentToAppend = {};
                    commentToAppend.comment_date = "Today";
                    commentToAppend.comment_time = "Just Now";
                    commentToAppend.username = data.username;
                    commentToAppend.comment_body = data.comment_body
                    $scope.comments.unshift(commentToAppend);
                }
                else {
                    $.notify("An issue occurred when trying to post your comment.",'error');
                }
              }, function errorCallback(data) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              $.notify("An issue occurred when trying to post your comment.",'error');
              });
          }
        };

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
            followsPost.is_followed = $scope.postMainContent[0].username;
            $http({
                method: 'POST',
                url: urlForPost,
                data: followsPost
            }).then(function successCallback(returnData) {
                if (returnData.data.message != "Failure!") {
                    $scope.follows = !$scope.follows;
                    if($scope.follows){
                      $.notify("You are now following "+$scope.postMainContent[0].username,'success');
                    }
                    else{
                      $.notify("You have unfollowed "+$scope.postMainContent[0].username,'success');
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

      $scope.onClickFavoriteButton = function(){
        if($scope.errorlogin){
          $.notify('You need to login in order to favorite a post','error');
        }
        else{
          if($scope.favorites){
            urlForPost = '/api/unfavorite'
          }
          else{
            urlForPost = '/api/favorite'
          }
          var favoritePost = {};
          favoritePost.username = myUser;
          favoritePost.title = title;
          favoritePost.date = date;
          favoritePost.time = time;
          $http({
              method: 'POST',
              url: urlForPost,
              data: favoritePost
          }).then(function successCallback(returnData) {
              if (returnData.data.message != "Failure!") {
                  $scope.favorites = !$scope.favorites;
                  if($scope.favorites){
                    $.notify("You have favorited "+favoritePost.title,'success');
                  }
                  else{
                    $.notify("You have unfavorited "+favoritePost.title,'success');
                  }
                  $scope.assignFavoritesButton();
              }
              else{
                  $.notify("There was an issue with favoriting. Try reloading the page and trying again.",'error');
              }
        }, function errorOccurred(errorData){
          $.notify("There was an issue with favoriting. Try reloading the page and trying again.",'error');
        })
      }
    };

}]);
