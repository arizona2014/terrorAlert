angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$rootScope,$http) {
  $scope.sendAlert = function(){
    var data = {
      coordinate: '5.101, 88.11',
      datetime: '10 Iulie 2016',
      severity: '1',
      user: 'andy',
      comments: ''
    };
    $http.post("http://localohost:3000/alert",data);
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($rootScope) {
  $rootScope.settings = {
    connected: false
  };
});
