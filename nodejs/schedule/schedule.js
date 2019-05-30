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
      "select gym_ID, gym_name, fac_ID, fac_name ,starttime, endtime, schedule_ID, TO_DAYS(sysdate()) - TO_DAYS(starttime) as dday  from schedule_detail where schedule_ID in (select reserv_ID from reserv_matches_team where reserv_team_ID in (select team_ID from team_user_list where UDID = ?) or opponent_team_ID in (select team_ID from team_user_list where UDID = ?)) order by starttime desc limit 5",
    [data.UDID, data.UDID],
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
      'SELECT gym_ID, gym_name, fac_ID, fac_name ,starttime, endtime, schedule_ID, TO_DAYS(sysdate()) - TO_DAYS(starttime) as dday from fac_schedule natural join gym NATURAL join fac_info where schedule_ID in (SELECT reserv_ID from reserv_matches WHERE reserv_team_ID = ( SELECT team_ID from team_user_list where UDID = ?)) LIMIT 2',
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
      'SELECT gym_ID, gym_name, fac_ID, fac_name ,starttime, endtime, schedule_ID, max_participant, min_participant, cur_participant, TO_DAYS(sysdate()) - TO_DAYS(starttime) as dday from schedule_detail where schedule_ID in (SELECT reserv_ID as schedule_ID from open_matches where UDID = ?) order by starttime desc limit 5',
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
      'SELECT gym_ID, fac_ID, schedule_ID, gym_name, fac_name, schedule_name, schedule_detail, schedule_type, avail_starttime, avail_endtime, starttime, endtime, min_participant, max_participant, cur_participant, gym_location, gym_latitude, gym_longitude, gym_info, subj_info, subj_ID from fac_schedule natural join gym NATURAL join fac_info where schedule_ID = ?',
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
    var connection = mysqlLoader.mysql_load();
    console.log(data)
    data.gym_ID = data.gym_ID.toString()
    data.subj_ID = data.subj_ID.toString()
    connection.query(
      "(select schedule_ID, gym_ID, schedule_name, starttime, endtime, schedule_type, "+
       "'0' as cur_status, "+
        "NULL as reserv_team_ID,"+ 
        "NULL as reserv_team_name, "+
        "NULL as reserv_team_MMR, "+
        "NULL as reserv_winning_rate, "+
        "NULL as opponent_team_ID, "+
        "NULL as opponent_team_name, "+
        "NULL as opponent_team_MMR, "+
        "NULL as opponent_winning_rate, "+
        "NULL as is_solo "+
        "from fac_schedule where (schedule_type = '1' or schedule_type = '3') and schedule_ID not in (select reserv_ID from reserv_matches) "+
        "and gym_ID = ? and subj_ID = ? "+
        "and starttime >= STR_TO_DATE(?, '%Y-%m-%d') and starttime < STR_TO_DATE(?, '%Y-%m-%d')"+
        ") "+
        "union "+
        "(select schedule_ID, gym_ID, schedule_name, starttime, endtime, schedule_type, "+
        "'1' as cur_status, "+
        "reserv_team_ID, "+
        "reserv_team_name, "+
        "reserv_team_MMR, "+
        "reserv_winning_rate, "+
        "opponent_team_ID, "+
        "opponent_team_name, "+
        "opponent_team_MMR, "+
        "opponent_winning_rate,"+
        "is_solo "+
        "from reserv_matches_team c join fac_schedule d on (c.reserv_ID = d.schedule_ID) "+
        "and gym_ID = ? and d.subj_ID = ?"+
        "and starttime >= STR_TO_DATE(?, '%Y-%m-%d') and starttime < STR_TO_DATE(?, '%Y-%m-%d')"+
        ")",
    [data.gym_ID, data.subj_ID, data.startdate, data.enddate, data.gym_ID, data.subj_ID, data.startdate, data.enddate],
    function(err, results){
      if(err)
        console.log(err);
      else{
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
      "SELECT schedule_ID, schedule_name, gym_ID, starttime, "+
      "endtime, schedule_type, cur_participant, max_participant, min_participant "+
      "from fac_schedule as a left join "+
      "(select reserv_ID, UDID from open_matches) as b "+
      "on (a.schedule_ID = b.reserv_ID) "+
      "WHERE gym_ID = ? "+
      "AND (schedule_type = '2' OR schedule_type = '3') "+
      "and starttime >= STR_TO_DATE(?, '%Y-%m-%d') and starttime < STR_TO_DATE(?, '%Y-%m-%d') "+
      "AND subj_ID = ? GROUP by schedule_ID ",
    [data.gym_ID, data.subj_ID, data.startdate, data.enddate],
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
      "SELECT UDID, ID, name, MMR, gender "+
      "from `user` "+
      "natural join soccer_record "+
      "where UDID in (SELECT UDID from open_matches where reserv_ID = ?)",
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