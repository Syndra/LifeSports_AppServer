const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader.js")

//Get Test
exports.getScheduleByFac = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      'SELECT schedule_ID, schedule_name, starttime, endtime, a.fac_name, min_participant, max_participant FROM fac_schedule NATURAL JOIN (SELECT fac_ID, fac_name FROM fac_info) as a WHERE gym_ID = ? AND subj_ID = ?',
    [data.gym_ID],[data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}
