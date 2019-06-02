const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader.js")

//Register New User
exports.regiUser = function (request, response) {
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () => {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      'INSERT INTO `user` (ID, PWD, name, gender, birth) VALUES (?, ?, ?, ?, ?)',
      [data.ID, data.PWD, data.name, data.gender, data.birth],
      function (err, results) {
        if (err)
          console.log(err);
        else {
          connection.query(
            'INSERT INTO `soccer_record` (UDID, main_foot, main_position, subjective_skill, career) VALUES ((select max(UDID) from `user`), ?, ?, ?, ?)',
            [data.mainFoot, data.mainRole, data.skill, data.career],
            function (err, results) {
              if (err)
                console.log(err);
              else {
                response.send("Success");
              }
            });
        }
      });
  });

}

//Try to login
exports.loginTry = function (request, response) {
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () => {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      'SELECT UDID, ID, name, gender, MMR FROM `user` natural join soccer_record WHERE ID=? AND PWD=?',
      [data.ID, data.PWD],
      function (err, result) {
        if (err)
          console.log(err);
        else {
          connection.query(
            "SELECT if(count(*) = '0', '0', '1') as hasTeam "+
            "FROM team "+
            "WHERE team_leader_UDID = ?",
            [result[0].UDID],
            function (err, results) {
              if (err)
                console.log(err);
              else {
                result[0].isLeader = results[0].hasTeam;
                response.send(result);
              }
            });
        }
      });
  });

}

//get User Information
exports.getUserInfo = function (request, response) {
  var body = '';
  const chunks = [];
  var _data;

  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () => {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      'SELECT ID, name, gender, birth, profile_fig, mvp_point FROM `user` natural join soccer_record WHERE UDID = ?',
      [data.UDID],
      function (err, result) {
        if (err)
          console.log(err);
        else {
          connection.query(
            "select count(*) as month_0 " +
            "from fac_schedule " +
            "where " +
            "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -0 month)) " +
            "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -0 month)) " +
            "AND schedule_ID in " +
            "( " +
            "select match_ID as schedule_ID " +
            "from open_match_participant " +
            "where UDID = ?" +
            ")",
            [data.UDID], function (err, results) {
              if (err)
                console.log(err);
              else {
                result[0].month_0 = results[0].month_0;
                connection.query(
                  "select count(*) as month_1 " +
                  "from fac_schedule " +
                  "where " +
                  "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -1 month)) " +
                  "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -1 month)) " +
                  "AND schedule_ID in " +
                  "( " +
                  "select match_ID as schedule_ID " +
                  "from open_match_participant " +
                  "where UDID = ?" +
                  ")",
                  [data.UDID], function (err, results) {
                    if (err)
                      console.log(err);
                    else {
                      result[0].month_1 = results[0].month_1;
                      connection.query(
                        "select count(*) as month_2 " +
                        "from fac_schedule " +
                        "where " +
                        "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -2 month)) " +
                        "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -2 month)) " +
                        "AND schedule_ID in " +
                        "( " +
                        "select match_ID as schedule_ID " +
                        "from open_match_participant " +
                        "where UDID = ?" +
                        ")",
                        [data.UDID], function (err, results) {
                          if (err)
                            console.log(err);
                          else {
                            result[0].month_2 = results[0].month_2;
                            connection.query(
                              "select count(*) as month_3 " +
                              "from fac_schedule " +
                              "where " +
                              "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -3 month)) " +
                              "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -3 month)) " +
                              "AND schedule_ID in " +
                              "( " +
                              "select match_ID as schedule_ID " +
                              "from open_match_participant " +
                              "where UDID = ?" +
                              ")",
                              [data.UDID], function (err, results) {
                                if (err)
                                  console.log(err);
                                else {
                                  result[0].month_3 = results[0].month_3;
                                  connection.query(
                                    "select count(*) as month_4 " +
                                    "from fac_schedule " +
                                    "where " +
                                    "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -4 month)) " +
                                    "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -4 month)) " +
                                    "AND schedule_ID in " +
                                    "( " +
                                    "select match_ID as schedule_ID " +
                                    "from open_match_participant " +
                                    "where UDID = ?" +
                                    ")",
                                    [data.UDID], function (err, results) {
                                      if (err)
                                        console.log(err);
                                      else {
                                        result[0].month_4 = results[0].month_4;
                                        connection.query(
                                          "select count(*) as ranking " +
                                          "from soccer_record " +
                                          "where MMR > (select MMR from soccer_record where UDID = ?)",
                                          [data.UDID], function (err, results) {
                                            if (err)
                                              console.log(err);
                                            else {
                                              result[0].ranking = results[0].ranking;
                                              connection.query(
                                                "select UDID, MMR, name, profile_fig "+
                                                "from soccer_record natural join `user` "+
                                                "where MMR > (select MMR from soccer_record where UDID = ?) "+
                                                "order by MMR "+
                                                "limit 2",
                                                [data.UDID], function (err, results) {
                                                  if (err)
                                                    console.log(err);
                                                  else {
                                                    result[0].upper_user = results;
                                                    connection.query(
                                                      "select UDID, MMR, name, profile_fig "+
                                                      "from soccer_record natural join `user` "+
                                                      "where MMR < (select MMR from soccer_record where UDID = ?) "+
                                                      "order by MMR desc "+
                                                      "limit 2",
                                                      [data.UDID], function (err, results) {
                                                        if (err)
                                                          console.log(err);
                                                        else {
                                                          result[0].under_user = results;
                                                          connection.query(
                                                            "select count(*) as total_match "+
                                                            "from open_match_participant "+
                                                            "where UDID = ?",
                                                            [data.UDID], function (err, results) {
                                                              if (err)
                                                                console.log(err);
                                                              else {
                                                                result[0].total_match = results[0].total_match;
                                                                connection.query(
                                                                  "select (sum(is_win) / count(*)) as recent_winning_rate from "+
                                                                  "( "+
                                                                  "select * "+
                                                                  "from fac_schedule natural join  "+
                                                                  "( "+
                                                                  "select match_ID as schedule_ID, UDID, is_win from match_participant where UDID = ? "+
                                                                  ") as b "+
                                                                  "order by starttime desc "+
                                                                  "limit 10 "+
                                                                  ") as c",
                                                                  [data.UDID], function (err, results) {
                                                                    if (err)
                                                                      console.log(err);
                                                                    else {
                                                                      result[0].recent_winning_rate = results[0].recent_winning_rate;
                                                                      console.log(result);
                                                                      response.send(result);
                                                                    }
                                                                  });
                                                              }
                                                            });
                                                        }
                                                      });
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                          }
                        });
                    }
                  });
              }
            });

        }
      });
  });

}

//중복검사
exports.checkIdDup = function (request, response) {
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () => {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      'SELECT COUNT(*) as isduplicated FROM `user` WHERE ID = ?',
      [data.ID],
      function (err, results) {
        if (err)
          console.log(err);
        else {
          response.send(results);
        }
      });
  });

}


//유저가 가입한 팀 목록 조회
exports.searchUserTeam = function (request, response) {
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () => {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      "SELECT team_ID, team_name, team_leader_UDID, team_MMR, team_main_subj, winning_rate, if(team_leader_UDID = ?, '1', '0') as isleader from team natural join team_user_list where UDID = ?",
      [data.UDID, data.UDID],
      function (err, results) {
        if (err)
          console.log(err);
        else {
          response.send(results);
        }
      });
  });

}

function get_month_record(connection, data) {


}