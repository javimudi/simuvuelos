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
		   		var name = subsplitted[1].replace(/\"/g, '');
		   		var code = subsplitted[4].replace(/\"/g, '');;
		   		var lat = parseFloat(subsplitted[6]);
		   		var lng = parseFloat(subsplitted[7]);
		   		if(_.indexOf(spanishAirports, code)>0){
		   			console.log("Adding " + code);
			   		airports[code] = { 
			   			lat: lat, 
			   			lng: lng, 
			   			message: name,
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

	return {
	  getSpanishAirports: spanishAirports,
	  getAirports: function(){ return airports; },
	  updateAirports: updateAirports
	}

}]);