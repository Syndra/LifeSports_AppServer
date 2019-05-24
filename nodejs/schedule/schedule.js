const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader.js")

//시설별 일정조회
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
    [data.gym_ID, data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//예약 현황 조회
exports.reservationStatus = function (request, response)
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
      'SELECT gym_ID, gym_name, fac_ID, fac_name ,starttime, endtime, schedule_ID from fac_schedule natural join gym NATURAL join fac_info where schedule_ID in (SELECT reserv_ID from reserv_matches WHERE reserv_team_ID = ( SELECT team_ID from team_user_list where UDID = ?))',
    [data.UDID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//예약 현황 조회 TEST
exports.reservationStatusTEST = function (request, response)
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
      'SELECT gym_ID, gym_name, fac_ID, fac_name ,starttime, endtime, schedule_ID from fac_schedule natural join gym NATURAL join fac_info where schedule_ID in (SELECT reserv_ID from reserv_matches WHERE reserv_team_ID = ( SELECT team_ID from team_user_list where UDID = ?)) LIMIT 2',
    [data.UDID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//매칭 현황 조회
exports.matchingStatus = function (request, response)
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
      'SELECT gym_ID, gym_name, fac_ID, fac_name ,starttime, endtime, schedule_ID, max_participant, min_participant, cur_participant from fac_schedule NATURAL join gym NATURAL join fac_info where schedule_ID in (SELECT reserv_ID as schedule_ID from open_matches where UDID = ?)',
    [data.UDID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//예약 상세 조회 & 매칭 상세 조회
exports.reservationDetail = function (request, response)
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
      'SELECT gym_ID, fac_ID, schedule_ID, gym_name, fac_name, schedule_name, schedule_detail, schedule_type, avail_starttime, avail_endtime, starttime, endtime, min_participant, max_participant, cur_participant, gym_location, gym_latitude, gym_longitude, gym_info, subj_info from fac_schedule natural join gym NATURAL join fac_info where schedule_ID = ?',
    [data.schedule_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//예약 타입 일정 조회
exports.reservationTypeSearch = function (request, response)
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
      "SELECT schedule_ID, schedule_name, gym_ID, reserv_ID, starttime, endtime, if (isnull(reserv_ID), '0', '1') as cur_status, schedule_type from fac_schedule as a  left join (select reserv_ID, reserv_team_ID from reserv_matches) as b on (a.schedule_ID = b.reserv_ID) WHERE gym_ID = ? AND (schedule_type = '1' OR schedule_type = '3') AND subj_ID = ?",
    [data.gym_ID, data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        for(var i = 0; i < results.length; i++){
          console.log(results[i]);
        }
        response.send(results);
      }
    });
  });

}

//매칭 타입 일정 조회
exports.matchingTypeSearch = function (request, response)
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
      "SELECT schedule_ID, schedule_name, gym_ID, starttime, endtime, schedule_type, cur_participant, max_participant, min_participant from fac_schedule as a left join (select reserv_ID, UDID from open_matches) as b on (a.schedule_ID = b.reserv_ID) WHERE gym_ID = ? AND (schedule_type = '2' OR schedule_type = '3') AND subj_ID = ? GROUP by schedule_ID",
    [data.gym_ID, data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//예약 - 예약하기
exports.insertReservation = function (request, response)
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
      "INSERT into reserv_matches (reserv_ID, subj_ID, reserv_team_ID) values (?, (select subj_ID from fac_schedule where schedule_ID = ?), (select team_ID from team where team_leader_UDID = ?))",
    [data.schedule_ID, data.schedule_ID, data.UDID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//예약 - 예약하기
exports.joinMatching = function (request, response)
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
      "INSERT into open_matches (reserv_ID, subj_ID, UDID) values (?, (select subj_ID from fac_schedule where schedule_ID = ?), ?)",
    [data.schedule_ID, data.schedule_ID, data.UDID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//매칭 참여자 목록 조회
exports.matchingUserList = function (request, response)
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
      "SELECT ID, name from `user` where UDID in (SELECT UDID from open_matches where reserv_ID = ?)",
    [data.schedule_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}