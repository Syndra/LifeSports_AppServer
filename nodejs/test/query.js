/**
 * 
 * 
select count(*) as month_0
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -0 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -0 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_participant
where UDID = '1'
)

select count(*) as month_1
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -1 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -1 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_participant
where UDID = '1'
)

select count(*) as month_2
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -2 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -2 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_participant
where UDID = '1'
)

select count(*) as month_3
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -3 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -3 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_participant
where UDID = '1'
)

select count(*) as month_4
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -4 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -4 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_participant
where UDID = '1'
)

select count(*) as ranking
from soccer_record
where MMR > (select MMR from soccer_record where UDID = '5')

select UDID, MMR, name, profile_fig
from soccer_record natural join `user`
where MMR > (select MMR from soccer_record where UDID = '5')
order by MMR
limit 2

select UDID, MMR, name, profile_fig
from soccer_record natural join `user`
where MMR < (select MMR from soccer_record where UDID = '5')
order by MMR desc
limit 2

select count(*) as total_match
from match_participant
where UDID = '1'

select mvp_point
from soccer_record
where UDID = '1'

select (sum(is_win) / count(*)) as recent_winning_rate from
(
select *
from fac_schedule natural join 
(
select match_ID as schedule_ID, UDID, is_win from match_participant where UDID = '1'
) as b
order by starttime desc
limit 10
) as c


TEAM


select count(*) as month_0
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -0 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -0 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_result
where win_team_ID = '1' or lose_team_ID = '1'
)

select count(*) as month_1
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -1 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -1 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_result
where win_team_ID = '1' or lose_team_ID = '1'
)

select count(*) as month_2
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -2 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -2 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_result
where win_team_ID = '1' or lose_team_ID = '1'
)

select count(*) as month_3
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -3 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -3 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_result
where win_team_ID = '1' or lose_team_ID = '1'
)

select count(*) as month_4
from fac_schedule
where
YEAR(starttime) = YEAR(DATE_ADD(NOW(),  INTERVAL -4 month))
AND MONTH(starttime) = MONTH(DATE_ADD(NOW(),  INTERVAL -4 month))
AND schedule_ID in
(
select match_ID as schedule_ID
from match_result
where win_team_ID = '1' or lose_team_ID = '1'
)

set @rownum = 0;

select UDID, profile_fig, name, MMR, @rownum := @rownum + 1 as `rank` from `user` natural join soccer_record where UDID in (
select UDID from team_user_list where team_ID = '1') order by MMR desc;

set @rownum = 0

select `rank` as my_rank from(
select UDID, profile_fig, name, MMR, @rownum := @rownum + 1 as `rank` from `user` natural join soccer_record where UDID in (
select UDID from team_user_list where team_ID = '1') order by MMR desc) as b
where UDID = '1'

select count(*) as total_match
from match_result
where win_team_ID = '1' or lose_team_ID = '1'

select (sum(is_win) / count(*)) as recent_winning_rate
from
(
select if(win_team_ID = '1', '1', '0') as is_win
from match_result join fac_schedule on (match_ID = schedule_ID)
where win_team_ID = '1' or lose_team_ID = '1'
order by starttime
limit 10
) as b

select count(*) as team_member_num from team_user_list
where team_ID = '1'




 * 
 */