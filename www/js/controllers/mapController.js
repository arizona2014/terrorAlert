angular.module('starter').controller('MapController',
  [ '$scope',
    '$http',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'AlertsService',
    'InstructionsService',
    function(
      $scope,
      $http,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      LocationsService,
      AlertsService,
      InstructionsService
      ) {

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        $scope.locations = LocationsService.savedLocations;
        $scope.newLocation;

        if(!InstructionsService.instructions.newLocations.seen) {

          var instructionsPopup = $ionicPopup.alert({
            title: 'Add Locations',
            template: InstructionsService.instructions.newLocations.text
          });
          instructionsPopup.then(function(res) {
            InstructionsService.instructions.newLocations.seen = true;
            });

        }

        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };
        
        $scope.goToMyCurrentLocation();

      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
        });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.newLocation.timestamp = new Date();        
        $scope.modal.show();
      });

      $scope.saveLocation = function() {        
        AlertsService.saveAlert($scope.newLocation);
        $scope.modal.hide();
        $scope.goTo(LocationsService.savedLocations.length - 1);
      };

      $scope.alerts = AlertsService;
      $scope.alerts.alertLocations();

      /**
       * Center map on current location at start of the application
       * @param locationKey
       */
      $scope.goToMyCurrentLocation = function() {

        $scope.map.center  = {
          lat : 0,
          lng : 0,
          zoom : 12
        };

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {

            var msg = "Current location";
            for(i=0;i<$scope.alerts.data.length;i++){

              if( Math.round(L.latLng([ $scope.alerts.data[i].lat, $scope.alerts.data[i].lng]).distanceTo([position.coords.latitude, position.coords.longitude]) / 1000) <= 1 ){
                msg += " - alert present here.";
              }

            }

            $scope.map.center  = {
              lat : position.coords.latitude,
              lng : position.coords.longitude,
              zoom : 12
            };

            $scope.map.markers[0] = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              message: msg,
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };

      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function(locationKey) {

        var location = LocationsService.savedLocations[locationKey];

        var msg = location.name;
        for(i=0;i<$scope.alerts.data.length;i++){
          if( Math.round(L.latLng([ $scope.alerts.data[i].lat, $scope.alerts.data[i].lng]).distanceTo([location.lat, location.lng]) / 1000) <= 1 ){
            msg += " - alert present here.";
          }
        }

        $scope.map.center  = {
          lat : location.lat,
          lng : location.lng,
          zoom : 12
        };

        $scope.map.markers[locationKey] = {
          lat:location.lat,
          lng:location.lng,
          message: msg,
          focus: true,
          draggable: false
        };

      };

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        var msg = "You Are Here";

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            for(i=0;i<$scope.alerts.data.length;i++){
              if( Math.round(L.latLng([ $scope.alerts.data[i].lat, $scope.alerts.data[i].lng]).distanceTo([position.coords.latitude, position.coords.longitude]) / 1000) <= 1 ){
                msg += " - alert present here.";
              }
            }

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: msg,
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };

    }]);
