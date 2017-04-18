angular.module('app',['ngCookies'])
.controller('mainController',['$scope','$http','$cookies','$window',function($scope,$http,$cookies,$window){
  $scope.offset = 0;
  $scope.currentGenre = "";
  $scope.currentSearch = "";

  $scope.searchPosts = function(){
    $scope.packetToSend = {};
    $scope.packetToSend.name = $scope.currentSearch;
    if($scope.currentGenre.trim() != ""){
      $scope.packetToSend.genre = $scope.currentGenre;
    }
    $scope.offset = 0;
    $scope.packetToSend.offset = $scope.offset;
    console.log($scope.packetToSend);
    $http({
        method: 'POST',
        url: '/api/mostVisitedPostsForGame',
        data: $scope.packetToSend
    }).then(function successCallback(data) {
            $scope.topPosts = data.data;
            $scope.offset += 10;
            if(data.data.length > 0){
              $("#loadMore").show();
            }
            else{
              $("#loadMore").hide();
            }
            console.log($scope.topPosts);
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };

  $scope.loadMore = function(){
    $scope.packetToSend.offset = $scope.offset;
    console.log($scope.packetToSend);
    $http({
        method: 'POST',
        url: '/api/mostVisitedPostsForGame',
        data: $scope.packetToSend
    }).then(function successCallback(data) {
      if(data.data.length > 0){
        $scope.topPosts = $scope.topPosts.concat(data.data);
        $scope.offset += 10;
        console.log($scope.topPosts);
      }
      else{
        $("#loadMore").hide();
      }
    }, function errorCallback(data) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
  };

  $http({
      method: 'GET',
      url: '/api/genres'
  }).then(function successCallback(data) {
          $scope.genres = data.data;
          console.log($scope.genres);
  }, function errorCallback(data) {
  // called asynchronously if an error occurs
  // or server returns response with an error status.
  });

  $scope.searchPosts();

}]);
