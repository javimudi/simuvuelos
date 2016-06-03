'use strict';

var app = angular.module('simuvuelosApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });


app.factory('airportsService', ['$http',
  function($http){

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

    var apiurl = 'http://raw.githubusercontent.com/javimudi/openflights/master/data/airports.dat'

    var updateAirports = function(){
      
      console.log("Downloading");

      $http.get(apiurl)
      .then(function(response){
        console.log(response.data);
      });
    }

    updateAirports();

    return {
      getSpanishAirports: spanishAirports
    }

}]);