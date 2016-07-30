angular.module('starter').factory('AlertsService', [ '$http', function($http) {

  var server="http://localhost:8001/api/alerts";
  return {
      data:{},
      alertLocations: function(){
          var self = this;
          $http.get(server)
          .success(function(data, status, headers, config) {
              self.data = data;
          })
          .error(function(data, status, headers, config) {
              console.log("data ko");
          });
      },
      saveAlert: function(alert){
          $http({
            url: server,
            method: "POST",
            data: alert
          })
          .success(function(data, status, headers, config) {
              console.log('data ok');
          })
          .error(function(data, status, headers, config) {
              console.log("data ko");
          });
      }
  }

}]);

