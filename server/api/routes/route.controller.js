/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index

 */

'use strict';

var http = require('http');
var cheerio = require('cheerio');
var _ = require('lodash');

var debug = true;

// Get list of things
exports.index = function(req, res) {
  var url ='http://www.aena.es/csee/Satellite/infovuelos/es/?';
  var query = require('querystring').stringify(req.query);
  console.log(url + query);
  
  var getter = http.get(url + query, function(res){

    var data = '';

    var dataParser = function(){
      // Parsing data
      var $ = cheerio.load(data);
      $('tr').each(function(){
          
          var array = $(this).find('td');
          var link = $($(array[1]).find('a')[0]).attr('href');
          var dest = $(array[2]).text();

          var pattern1 = /^\/csee\/Satellite\/infovuelos\/es\/\?company\=([A-Z]{3})\&hprevista=(.*)\&mov=[L|S]\&nvuelo=([0-9]{4})&origin_ac=(.{3})/;
          var pattern2 = /\ (.*)\ \((\D{3})\)/;
          var pattern3 = /(\d{4})\-(\d{2})\-(\d{2})\+(\d{2})\%3A(\d{2})/;
          var re = pattern2.exec(dest);
          

          if(re!=null){
              var name = re[1];
              dest = re[2];
              var arrl = pattern1.exec(link);

              var hiturl = 'http://www.aena.es/' + link;
              console.log(hiturl);

              if (arrl!=null){
                  var hprevista = pattern3.exec(arrl[2]);
                  var code = arrl[4];
                  var name = name;
                  var company = arrl[1];
                  var nvuelo = arrl[3];

                  if(hprevista!=null){
                      var fecha = new Date(hprevista[1],hprevista[2]-1,hprevista[3],hprevista[4],hprevista[5]);
                      var hours = (fecha.getHours()<10?'0':'') + fecha.getHours() 
                      var minutes = (fecha.getMinutes()<10?'0':'') + fecha.getMinutes() 
                      var hora = hours+":"+minutes;

                      var doc = {
                          from: code,
                          to: dest,
                          hprevista: hora,
                      };

                      if(debug){ 
                        console.log(doc);
                      }
    
                  }
              }
          }
      });
    }




    res.on('data', function(chunk){
      data+= chunk;
    }).on('end', dataParser);
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
     });


  res.send(200);

}
