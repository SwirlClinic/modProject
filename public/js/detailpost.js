
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

}]);
