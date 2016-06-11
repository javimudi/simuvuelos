'use strict';

var app = angular.module('simuvuelosApp');

app.controller('MainCtrl', ['$scope', 'airportsService', 
function ($scope, airportsService) {


	$scope.allAirports = {};

	// Leaflet MAP
	angular.extend($scope,
	    {
	        center: {
	            lat: 37,
	            lng: -7,
	            zoom: 5
	        },

	        markers: airportsService.getAirports(),
	        defaults: {
	            tileLayer: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
	            zoomControlPosition: 'bottomright',
	            scrollWheelZoom: true
	        },

	    });


	// Starting data
	airportsService.updateAirports().then(function(response){
		$scope.allAirports = response;
	});

}]);


