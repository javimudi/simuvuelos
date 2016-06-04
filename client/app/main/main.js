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


app.factory('airportsService', ['$http', '$q',
function($http, $q){

	var spanishAirports = [
	  'ABC',        'ACE',
	  'AGP',        'ALC',        'BCN',        'BIO',
	  'BJZ',        'EAS',        'FUE',        'GMZ',
	  'GRO',        'GRX',        'HSK',        'IBZ',
	  'LCG',        'LEI',        'LEN',        'LPA',
	  'MAD',        'MAH',        'MCV',        'MJV',
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
		   		var code = subsplitted[4];
		   		code = code.replace(/\"/g, '');
		   		var lat = subsplitted[6];
		   		var lng = subsplitted[7];
		   		airports[code] = { 'lat': lat, 'lng': lng }
	   		}
	   		catch(e){}

	   	})
	    return airports;
	    
	  }).finally(function(){
	  	console.log("Done!");
	  });
	}

	return {
	  getSpanishAirports: spanishAirports,
	  getAirports: function(){ return airports; },
	  updateAirports: updateAirports
	}

}]);