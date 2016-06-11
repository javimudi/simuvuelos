'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('simuvuelosApp'));

  // External
  var MainCtrl, scope, service,
  $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {



    var $controller = $injector.get('$controller');
    var $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    service = $injector.get('airportsService');
    $httpBackend = $injector.get('$httpBackend');
    MainCtrl = $controller('MainCtrl', { $scope: scope, airportsService: service});


  }));


  it('shoud be defined', function(){
    expect(MainCtrl).toBeDefined();
  })

  it('should attach a empty list of airports to the scope', function () {

    // No Spanish airports

    var csvresponse = '1,"Goroka","Goroka","Papua New Guinea","GKA","AYGA",-6.081689,145.391881,5282,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '2,"Madang","Madang","Papua New Guinea","MAG","AYMD",-5.207083,145.7887,20,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '3,"Mount Hagen","Mount Hagen","Papua New Guinea","HGU","AYMH",-5.826789,144.295861,5388,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '4,"Nadzab","Nadzab","Papua New Guinea","LAE","AYNZ",-6.569828,146.726242,239,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '5,"Port Moresby Jacksons Intl","Port Moresby","Papua New Guinea","POM","AYPY",-9.443383,147.22005,146,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '6,"Wewak Intl","Wewak","Papua New Guinea","WWK","AYWK",-3.583828,143.669186,19,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '7,"Narsarsuaq","Narssarssuaq","Greenland","UAK","BGBW",61.160517,-45.425978,112,-3,"E","America/Godthab"\n';
    csvresponse += '8,"Nuuk","Godthaab","Greenland","GOH","BGGH",64.190922,-51.678064,283,-3,"E","America/Godthab"\n';

    // Definition
    $httpBackend.expect('GET', 'http://raw.githubusercontent.com/javimudi/openflights/master/data/airports.dat').
    respond(csvresponse);

    $httpBackend.flush();
    scope.$apply();
    expect(scope.allAirports).toBeDefined();
    expect(Object.keys(scope.allAirports).length).toBe(0);
  });

  it('should attach a populated list of Spanish airports to the scope', function(){

    // Spanish airports, fake location

    var csvresponse = '1,"Goroka","Goroka","Papua New Guinea","SVQ","AYGA",-6.081689,145.391881,5282,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '2,"Madang","Madang","Papua New Guinea","MAD","AYMD",-5.207083,145.7887,20,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '3,"Mount Hagen","Mount Hagen","Papua New Guinea","XRY","AYMH",-5.826789,144.295861,5388,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '4,"Nadzab","Nadzab","Papua New Guinea","AGP","AYNZ",-6.569828,146.726242,239,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '5,"Port Moresby Jacksons Intl","Port Moresby","Papua New Guinea","BCN","AYPY",-9.443383,147.22005,146,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '6,"Wewak Intl","Wewak","Papua New Guinea","PMI","AYWK",-3.583828,143.669186,19,10,"U","Pacific/Port_Moresby"\n';
    csvresponse += '7,"Narsarsuaq","Narssarssuaq","Greenland","BIO","BGBW",61.160517,-45.425978,112,-3,"E","America/Godthab"\n';
    csvresponse += '8,"Nuuk","Godthaab","Greenland","REU","BGGH",64.190922,-51.678064,283,-3,"E","America/Godthab"\n';

    // Definition
    $httpBackend.expect('GET', 'http://raw.githubusercontent.com/javimudi/openflights/master/data/airports.dat').
    respond(csvresponse);

    $httpBackend.flush();
    scope.$apply();
    expect(scope.allAirports).toBeDefined();
    expect(Object.keys(scope.allAirports).length).toBeGreaterThan(5);
    expect(Object.keys(scope.allAirports).length).toBe(8);
  })

});
