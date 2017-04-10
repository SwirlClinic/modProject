
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

        $http({
              method: 'POST',
              url: '/api/posts/mainPostContent',
              data: postinfo
            }).then(function successCallback(data) {
                if(data.data.length > 0){
                  console.log(data.data);
                  $scope.postMainContent = data.data;
                }
                else{
                  $window.location.href = "/404.html";
                }
              }, function errorCallback(data) {
                    console.log(data);

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

}]);
