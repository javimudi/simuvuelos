/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /routes              ->  index

 */

'use strict';

var rp = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');
var moment = require('moment');
var Q = require('q');

var debug = true;



var parseRow = function(array){

}


// Get list of things
exports.index = function(req, res) {
      var url ='http://www.aena.es/csee/Satellite/infovuelos/es/?';
      var query = require('querystring').stringify(req.query);
      var results = [];
      console.log(url+query);
      rp.get(url + query)
      .then(function(response){
          // Parsing data
          var $ = cheerio.load(response);
          $('tr').each(function(){
                var array = $(this).find('td');
                var link = $($(array[1]).find('a')[0]).attr('href');
                var dest = $(array[2]).text();

                var pattern1 = /^\/csee\/Satellite\/infovuelos\/es\/\?company\=([A-Z]{3})\&hprevista=(.*)\&mov=[L|S]\&nvuelo=([0-9]{4})&origin_ac=(.{3})/;
                var pattern2 = /\ (.*)\ \((\D{3})\)/;
                var pattern3 = /(\d{4})\-(\d{2})\-(\d{2})\+(\d{2})\%3A(\d{2})/;
                var re = pattern2.exec(dest);
                
                if(re!==null){
                    var name = re[1];
                    dest = re[2];
                    var arrl = pattern1.exec(link);

                    var hiturl = 'http://www.aena.es/' + link;



                    if (arrl!==null){
                        var expectedDate = pattern3.exec(arrl[2]);
                        var code = arrl[4];
                        var company = arrl[1];
                        var flightno = arrl[3];

                        if(expectedDate!==null){
                            var when = new Date(expectedDate[1],
                              expectedDate[2]-1,
                              expectedDate[3],
                              expectedDate[4],
                              expectedDate[5]);
      
                            var doc = {
                                company: company,
                                flightno: flightno,
                            };

                            doc.infourl = hiturl;

                            if(req.query.mov==='S'){
                              doc.takeoff = moment(when);
                              doc.from = code;
                              doc.to = dest;
                            } else if(req.query.mov==='L'){
                              doc.landing = moment(when);
                              doc.from = dest;
                              doc.to = code;
                            }

                            results.push(doc);        
                        }
                    }


                }
          });
      })
      .finally(function(){

        var promises = [];
        var allresults = [];

            results.forEach(function(result){

            promises.push((function(){
                return rp.get(result.infourl).then(function(html){
                  var $hit = cheerio.load(html);
                  $hit('tr').each(function(){
                    var patternActualTakeoffs = /El vuelo ha despegado a las (\d{2}:\d{2})/;
                    var patternExpectedLandings = /Llegada prevista a las (\d{2}:\d{2})/;
                    var patternExpectedTakeoffs = /Despegue previsto a las (\d{2}:\d{2})/;
                    var patternActualLandings = /El vuelo ha aterrizado a las (\d{2}:\d{2})/;

                    var iarray = $hit(this).find('td');
                    var info = $hit(iarray[5]).text();
                    
                    var Eland = patternExpectedLandings.exec(info);
                    var Atake = patternActualTakeoffs.exec(info);
                    var Etake = patternExpectedTakeoffs.exec(info);
                    var Aland = patternActualLandings.exec(info);

                    var _prevdate = result.takeoff || result.landing; // TODO: Handle day changes

                    var prevdate = _prevdate.clone();
                    if(Atake!==null){
                        var actualTakeoff = prevdate;
                        actualTakeoff.hour(Atake[1].split(':')[0]);
                        actualTakeoff.minute(Atake[1].split(':')[1]);
                        result.actualTakeoff = actualTakeoff;

                    } 

                    if(Eland!==null){
                        var expectedLanding = prevdate;
                        expectedLanding.hour(Eland[1].split(':')[0]);
                        expectedLanding.minute(Eland[1].split(':')[1]);
                        result.expectedLanding = expectedLanding;                

                    }


                    if(Etake!==null){
                        var expectedTakeoff = prevdate;
                        expectedTakeoff.hour(Etake[1].split(':')[0]);
                        expectedTakeoff.minute(Etake[1].split(':')[1]);
                        result.expectedTakeoff = expectedTakeoff;                

                    }


                    if(Aland!==null){
                        var actualLanding = prevdate;
                        actualLanding.hour(Aland[1].split(':')[0]);
                        actualLanding.minute(Aland[1].split(':')[1]);
                        result.actualLanding = actualLanding;                

                    }            


                  })
                }).finally(function(){
                    allresults.push(result);
                    return result;
                });


            })());

        });

        Q.all(promises).then(function(){
            console.log(allresults);
            res.json(allresults);
        });
  });

};
