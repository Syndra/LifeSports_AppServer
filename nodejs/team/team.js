const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader.js")

//팀 정보 조회
exports.teamInfo = function (request, response)
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
      "SELECT UDID, ID, name, team_ID, team_name, team_main_subj, "+
      "team_MMR, winning_rate, team_fig from `user` as a "+
      "join (SELECT team_ID, team_name, team_leader_UDID, team_main_subj, "+
      "team_MMR, winning_rate, team_fig from team where team_ID = ?) as b "+
      "on (a.UDID = b.team_leader_UDID)",
    [data.team_ID],
    function(err, result){
      if(err)
        console.log(err);
      else{
        connection.query(
          "SELECT if(team_leader_UDID = ?, '1', '0') as isleader "+
          "FROM team "+
          "WHERE team_ID = ?",
        [data.UDID, data.team_ID],
        function(err, results){
          if(err)
            console.log(err);
          else{
            result[0].isleader = results[0].isleader;
            connection.query(
              "select count(*) as month_0 "+
              "from fac_schedule "+
              "where "+
              "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -0 month)) "+
              "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -0 month)) "+
              "AND schedule_ID in "+
              "( "+
              "select match_ID as schedule_ID "+
              "from match_result "+
              "where win_team_ID = ? or lose_team_ID = ?"+
              ")",
            [data.team_ID, data.team_ID],
            function(err, results){
              if(err)
                console.log(err);
              else{
                result[0].month_0 = results[0].month_0;
                connection.query(
                  "select count(*) as month_1 "+
                  "from fac_schedule "+
                  "where "+
                  "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -1 month)) "+
                  "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -1 month)) "+
                  "AND schedule_ID in "+
                  "( "+
                  "select match_ID as schedule_ID "+
                  "from match_result "+
                  "where win_team_ID = ? or lose_team_ID = ?"+
                  ")",
                [data.team_ID, data.team_ID],
                function(err, results){
                  if(err)
                    console.log(err);
                  else{
                    result[0].month_1 = results[0].month_1;
                    connection.query(
                      "select count(*) as month_2 "+
                      "from fac_schedule "+
                      "where "+
                      "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -2 month)) "+
                      "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -2 month)) "+
                      "AND schedule_ID in "+
                      "( "+
                      "select match_ID as schedule_ID "+
                      "from match_result "+
                      "where win_team_ID = ? or lose_team_ID = ?"+
                      ")",
                    [data.team_ID, data.team_ID],
                    function(err, results){
                      if(err)
                        console.log(err);
                      else{
                        result[0].month_2 = results[0].month_2;
                        connection.query(
                          "select count(*) as month_3 "+
                          "from fac_schedule "+
                          "where "+
                          "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -3 month)) "+
                          "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -3 month)) "+
                          "AND schedule_ID in "+
                          "( "+
                          "select match_ID as schedule_ID "+
                          "from match_result "+
                          "where win_team_ID = ? or lose_team_ID = ?"+
                          ")",
                        [data.team_ID, data.team_ID],
                        function(err, results){
                          if(err)
                            console.log(err);
                          else{
                            result[0].month_3 = results[0].month_3;
                            connection.query(
                              "select count(*) as month_4 "+
                              "from fac_schedule "+
                              "where "+
                              "YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -4 month)) "+
                              "AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -4 month)) "+
                              "AND schedule_ID in "+
                              "( "+
                              "select match_ID as schedule_ID "+
                              "from match_result "+
                              "where win_team_ID = ? or lose_team_ID = ?"+
                              ")",
                            [data.team_ID, data.team_ID],
                            function(err, results){
                              if(err)
                                console.log(err);
                              else{
                                result[0].month_4 = results[0].month_4;
                                connection.query( 
                                  "set @rownum = 0",
                                '',
                                function(err, results){
                                  if(err)
                                    console.log(err);
                                  else{
                                    connection.query(
                                      "select UDID, profile_fig, name, MMR, "+
                                      "@rownum := @rownum + 1 as `rank` from `user` "+
                                      "natural join soccer_record where UDID in ( "+
                                      "select UDID from team_user_list where team_ID = ?) order by MMR desc",
                                    [data.team_ID],
                                    function(err, results){
                                      if(err)
                                        console.log(err);
                                      else{
                                        result[0].user_rank_list = results;
                                        connection.query(
                                          "set @rownum = 0",
                                        '',
                                        function(err, results){
                                          if(err)
                                            console.log(err);
                                          else{
                                            connection.query(
                                              "select `rank` as my_rank from( "+
                                              "select UDID, profile_fig, name, MMR, @rownum := @rownum + 1 as `rank` from `user` natural join soccer_record where UDID in ( "+
                                              "select UDID from team_user_list where team_ID = ?) order by MMR desc) as b "+
                                              "where UDID = ?",
                                              [data.team_ID, data.UDID],
                                            function(err, results){
                                              if(err)
                                                console.log(err);
                                              else{
                                                try{
                                                  result[0].my_rank = results[0].my_rank;  
                                                }
                                                catch(e){
                                                  result[0].my_rank = null;
                                                }
                                                
                                                connection.query(
                                                  "select count(*) as total_match "+
                                                  "from match_result "+
                                                  "where win_team_ID = ? or lose_team_ID = ?",
                                                [data.team_ID, data.team_ID],
                                                function(err, results){
                                                  if(err)
                                                    console.log(err);
                                                  else{
                                                    result[0].total_match = results[0].total_match;
                                                    connection.query(
                                                      "select (sum(is_win) / count(*)) as recent_winning_rate "+
                                                      "from "+
                                                      "( "+
                                                      "select if(win_team_ID = ?, '1', '0') as is_win "+
                                                      "from match_result join fac_schedule on (match_ID = schedule_ID) "+
                                                      "where win_team_ID = ? or lose_team_ID = ? "+
                                                      "order by starttime "+
                                                      "limit 10 "+
                                                      ") as b",
                                                    [data.team_ID, data.team_ID, data.team_ID],
                                                    function(err, results){
                                                      if(err)
                                                        console.log(err);
                                                      else{
                                                        result[0].recent_winning_rate = results[0].recent_winning_rate;
                                                        connection.query(
                                                          "select count(*) as team_member_num from team_user_list "+
                                                          "where team_ID = ?",
                                                        [data.team_ID],
                                                        function(err, results){
                                                          if(err)
                                                            console.log(err);
                                                          else{
                                                            result[0].team_member_num = results[0].team_member_num;
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
              }
            });
          }
        });
      }
    });
  });

}

//팀 경기 결과 조회
exports.teamResultSearch = function (request, response)
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
      "SELECT match_ID, win_team_ID, win_team_name, win_team_MMR, win_winning_rate, lose_team_ID, lose_team_name, lose_team_MMR, lose_winning_rate, temp.gym_ID, gym_name, gym_location, mvp_UDID, mvp_ID, mvp_name from (SELECT match_ID, win_team_ID, lose_team_ID, a.gym_ID, a.fac_ID, score, mvp_UDID, starttime, endtime from match_result as a join fac_schedule as b on (match_ID = b.schedule_ID)) as temp join (select team_ID, team_name as win_team_name, team_MMR as win_team_MMR, winning_rate as win_winning_rate from team) as c on (temp.win_team_ID = c.team_ID) join (select team_ID, team_name as lose_team_name, team_MMR as lose_team_MMR, winning_rate as lose_winning_rate from team) as d on (temp.lose_team_ID = d.team_ID) join (select gym_ID, gym_name, gym_location from gym) as e on (temp.gym_ID = e.gym_ID) join (select UDID, ID as mvp_ID, name as mvp_name from `user`) as f on (temp.mvp_UDID = f.UDID) WHERE win_team_ID = ? OR lose_team_ID = ?",
    [data.team_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 멤버 목록 조회
exports.teamMemberSearch = function (request, response)
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
      "SELECT UDID, ID, MMR, name, gender from `user` natural join soccer_record where UDID in (SELECT UDID from team natural join team_user_list where team_ID = ?)",
    [data.team_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 검색
exports.searchTeam = function (request, response)
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
      "SELECT team_ID, team_name, team_leader_UDID, team_main_subj, winning_rate, team_MMR from team where team_name like '%" + data.searchword + "%' limit 5",
    [data.searchword],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 검색
exports.checkIdDup = function (request, response)
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
      "SELECT COUNT(*) as isduplicated FROM team WHERE team_name = ?",
    [data.team_name],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 생성
exports.createTeam = function (request, response)
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
      "insert into team (team_name, team_leader_UDID, team_MMR, team_main_subj, winning_rate) values (?, ?, '2000', ?, '0')",
    [data.team_name, data.UDID, data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
    });
    connection.query(
      "insert into team_user_list (team_ID, UDID) values((select max(team_ID) from team), ?)",
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