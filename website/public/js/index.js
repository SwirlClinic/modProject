
angular.module('app', [])

.controller('mainController', function($scope, $http) {
    $scope.formData = {};
    $scope.initialOffset = 10;

    $http({
      method: 'GET',
      url: '/api/posts/latest'
    }).then(function successCallback(data) {
            $scope.modposts = data.data;
            console.log(data.data);
      }, function errorCallback(data) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

$scope.onClickLoadMore = function(){
  $http({
    method: 'GET',
    url: '/api/posts/latest/' + $scope.initialOffset.toString()
  }).then(function successCallback(data) {
          if(data.data.length > 0){
            $scope.modposts = $scope.modposts.concat(data.data);
            console.log(data.data);
            $scope.initialOffset += 10;
          }
          else{
            $("#loadMore").hide();
          }
    }, function errorCallback(data) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
};



});
