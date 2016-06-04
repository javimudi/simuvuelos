'use strict';

var app = angular.module('simuvuelosApp');

app.controller('MainCtrl', ['$scope', '$q', 'airportsService', 
function ($scope, $q, airportsService) {

	$q.all([ airportsService.updateAirports() ]).then(function(d){
		// Actually DO something
		console.log(airportsService.getAirports().SVQ);
	});
	

}]);
