'use strict';

var app = angular.module('simuvuelosApp');

app.controller('MainCtrl', ['$scope', '$q', 'airportsService', 
function ($scope, $q, airportsService) {


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



	$q.all([ airportsService.updateAirports() ]).then(function(d){
		// Actually DO something
		// console.log(airportsService.getAirports());
	});
	

}]);


