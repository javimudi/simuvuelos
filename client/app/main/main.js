'use strict';

var app = angular.module('simuvuelosApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });


app.factory('airportsService', ['$http', '$q', '$timeout',
function($http, $q, $timeout){

	var spanishAirports = [
	  'ABC',        'ACE',
	  'AGP',        'ALC',        'BCN',        'BIO',
	  'BJZ',        'EAS',        'FUE',        'GMZ',
	  'GRO',        'GRX',        'HSK',        'IBZ',
	  'LCG',        'LEI',        'LEN',        'LPA',
	  'MAD',        'MAH',        'MJV',
	  'MLN',        'ODB',        'OVD',        'PMI',
	  'PNA',        'QSA',        'REU',        'RGS',
	  'RJL',        'SCQ',        'SDR',        'SLM',
	  'SPC',        'SVQ',        'TFN',        'TFS',
	  'TOJ',        'VDE',        'VGO',        'VIT',
	  'VLC',        'VLL',        'XRY',        'ZAZ'
	];    


	var airports = {};
	var apiurl = 'http://raw.githubusercontent.com/javimudi/openflights/master/data/airports.dat'
	var updateAirports = function(){

	  return $http.get(apiurl)
	  .then(function(response){
	   	var splitted = response.data.split('\n');
	   	angular.forEach(splitted, function(value){
	   		try {
		   		var subsplitted = value.split(',');
		   		var name = subsplitted[1].replace(/\"/g, '');
		   		var code = subsplitted[4].replace(/\"/g, '');;
		   		var lat = parseFloat(subsplitted[6]);
		   		var lng = parseFloat(subsplitted[7]);
		   		if(_.indexOf(spanishAirports, code)>0){
		   			console.log("Adding " + code);
			   		airports[code] = { 
			   			lat: lat, 
			   			lng: lng, 
			   			message: '<airport-message airport='+code+' name='+name+'></airport-messages>',
			   			focus: false,
			   			draggable: false,
			   			icon: {
			   				iconUrl: 'assets/images/paper-plane-16.png',
			   				iconSize: [16, 16]
			   			}   			
			   		}
			   	}
	   		}
	   		catch(e){}  	

	   	})
	    return airports;
	    
	  }).finally(function(){
	  	console.log("Done!");
	  });
	}


	var getRoutes = function(code, flavour){

		console.log("Getting " + flavour + " for " + code);

		var params = {};
        
	    code = (typeof code != 'undefined') ? code : 'SVQ';
	    flavour = (typeof flavour != 'undefined') ? flavour : 'arrivals';
	    var movement = (flavour=='arrivals') ? 'L' : 'S';

	    var url ='http://www.aena.es/csee/Satellite/infovuelos/es/';
	    params.destiny = ''; // Mandatory ??
	    params.mov = movement;
	    params.origin_ac = code;


		return $http.get(url, {params: params}).then(function(response){
			console.log(response);
			console.log("Dentro http");
			// var parser = new DOMParser();
			// var doc = parser.parseFromString(response.data, 'text/html');
			console.log(response.data);
			return response.data;
		});
	}


	var getDepartures = function(code){
	  	return getRoutes(code, 'departures');
	 }

	 var getArrivals = function(code) {
		 return getRoutes(code, 'arrivals'); 	
	 }

	return {
	  getSpanishAirports: function(){ return spanishAirports },
	  getAirports: function(){ return airports },
	  updateAirports: updateAirports,
	  getDepartures: getDepartures,
	  getArrivals: getArrivals
	}

}]);


app.controller('airportMessageCtlr', ['$scope', 'airportsService',
	function($scope, airportsService){
		$scope.getDepartures = airportsService.getDepartures;
		$scope.getArrivals = airportsService.getArrivals;
	}])


app.directive('airportMessage', function(){
	return {
		restrict: 'E',
		template: function(elem, attr){
			return '<a ng-click="getDepartures(\'' + attr.airport + '\')">'+attr.name+'</a>';
		},
		controller: 'airportMessageCtlr'
	}
})