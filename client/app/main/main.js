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

app.factory('decorationsService', 
	['$http',
	function($http){

		var slashed = { offset: 20, repeat: 12, symbol: L.Symbol.dash({pixelSize: 10, pathOptions: {color: '#f00', weight: 2}})};

		var decorations = {}	

        var add = function(route){

    		var poly = {}
    		poly.coordinates = [ route.from_coordinates, route.to_coordinates ];
    		slashed.offset = route.offset;
    		poly.patterns = [slashed];
    		poly.from = route.from;
    		poly.to = route.to;	

    		decorations[route.from+'_'+route.to] = poly;

    		console.log(poly);
        }

        var getDecorations = function(){
        	return decorations;
        }

        var clear = function(){
        	decorations = {};
        }

        return {
        	getDecorations: getDecorations,
        	add: add,
        	clear: clear
        }



	}]);

app.factory('airportsService', ['$http', '$timeout', 'decorationsService',
function($http, $timeout, decorationsService){

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
	var allAirports = {};
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


		   		allAirports[code] = { 
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

	    params.mov = movement;
	    params.origin_ac = code;

		return $http.get('/api/routes', {params: params}).then(function(response){
			return _.filter(response.data, function(route){ // Only known airports
				return (route.from in allAirports && route.to in allAirports);
			});
		}, function(response){
			console.log("ERROR: " + response);
		});
	}

	var getInFlights = function(code){
		var filtered = [];
		var oks = [];
		return getAllRoutes(code).then(function(routes){
			return _.filter(routes, function(route){
				return ('actualTakeoff' in route && 'expectedLanding' in route);
			});
		}).then(function(filtered){
			angular.forEach(filtered, function(inroute){
				inroute.offset = (function(){
					var now = moment();
					var takeoff = moment(inroute.actualTakeoff);
					var landing = moment(inroute.expectedLanding);

					if(takeoff.hours() > now.hours()){
						takeoff.add(-1, 'days');
					}

					if(landing<takeoff){
						landing.add(1, 'days');
					}

					console.log(now);
					console.log(takeoff);
					console.log(landing);

					var offset = 100 * (now - takeoff)/(landing - takeoff);
					console.log("Offset");
					console.log(offset);
					return offset;
				}());

				oks.push(inroute);
			});
		}).then(function(){
			return oks; 
		})
	}

	var getDepartures = function(code){
	  	return getRoutes(code, 'departures');
	 }

	 var getArrivals = function(code) {
		 return getRoutes(code, 'arrivals'); 	
	 }

	 var getAllRoutes = function(code){
	 	var all = [];
	 	var oks = [];
	 	return getDepartures(code).then(function(departures){
	 		return getArrivals(code).then(function(arrivals){
	 			return all = _.flatten(arrivals, departures);

	 		}).then(function(all){
	 			angular.forEach(all, function(route){
					route.from_coordinates = [allAirports[route.from].lat, allAirports[route.from].lng];
					route.to_coordinates = [allAirports[route.to].lat, allAirports[route.to].lng];
					// console.log(route);
					oks.push(route);
		 		});
		 		return true;

	 		}).then(function(){
	 			return oks;
	 		})
	 	});

	 }

	return {
	  getSpanishAirports: function(){ return spanishAirports },
	  getAirports: function(){ return airports },
	  getWorldAirports: function(){ return allAirports },
	  updateAirports: updateAirports,
	  getDepartures: getDepartures,
	  getArrivals: getArrivals,
	  getAllRoutes: getAllRoutes,
	  getInFlights: getInFlights
	}

}]);


app.controller('airportMessageCtlr', ['$scope', 'airportsService', 'decorationsService',
	function($scope, airportsService, decorationsService){
		$scope.getDepartures = airportsService.getDepartures;
		$scope.getArrivals = airportsService.getArrivals;

		$scope.getAllRoutes = function(code){
			airportsService.getAllRoutes(code).then(function(results){
				angular.forEach(results, function(route){
					decorationsService.add(route);
				});
			});
		}
		$scope.getInFlights = function(code){
			airportsService.getInFlights(code).then(function(results){
				angular.forEach(results, function(route){
					decorationsService.add(route);
				});
			});
		}

	}]);


app.directive('airportMessage', function(){
	return {
		restrict: 'E',
		template: function(elem, attr){
			return '<a ng-click="getInFlights(\'' + attr.airport + '\')">'+attr.name+'</a>';
		},
		controller: 'airportMessageCtlr'
	}
})