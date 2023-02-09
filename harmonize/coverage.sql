/* coverage.sql */

create temp view City as select * from "Actor" where type = 'city';
create temp view Country as select * from "Actor" where type = 'country';
create temp view Region as select * from "Actor" where type in ('adm1', 'adm2');
create temp view Region_Country as select Region.actor_id as region_id, Country.actor_id as country_id from Region join Country on Region.is_part_of = Country.actor_id;
create temp view City_Country as select City.actor_id as city_id, Country.actor_id as country_id from (City join Region on City.is_part_of = Region.actor_id) join Country on Region.is_part_of = Country.actor_id;

create table if not exists "Coverage" (
    actor_id varchar(255),
    country_emissions int,
    country_targets int,
    country_population int,
    country_gdp int,
    country_territory int,
    subnational_count int,
    subnational_emissions int,
    subnational_targets int,
    subnational_population int,
    subnational_gdp int,
    subnational_territory int,
    city_count int,
    city_emissions int,
    city_targets int,
    city_population int,
    city_gdp int,
    city_territory int);

insert into "Coverage" select actor_id from "Actor" where type = 'country';

update "Coverage" set country_emissions = (select count(distinct actor_id) from "EmissionsAgg" where "EmissionsAgg".actor_id = "Coverage".actor_id);
update "Coverage" set country_targets = (select count(distinct actor_id) from "Target" where "Target".actor_id = "Coverage".actor_id);
update "Coverage" set country_population = (select count(distinct actor_id) from "Population" where "Population".actor_id = "Coverage".actor_id);
update "Coverage" set country_gdp = (select count(distinct actor_id) from "GDP" where "GDP".actor_id = "Coverage".actor_id);
update "Coverage" set country_territory = (select count(distinct actor_id) from "Territory" where "Territory".actor_id = "Coverage".actor_id);

update "Coverage" set subnational_count = (select count(distinct actor_id) from "Actor" where "Actor".type = 'adm1' and "Actor".is_part_of = "Coverage".actor_id);
update "Coverage" set subnational_emissions = (select count(distinct "Actor".actor_id) from "Actor" join "EmissionsAgg" on "Actor".actor_id = "EmissionsAgg".actor_id where "Actor".type = 'adm1' and "Actor".is_part_of = "Coverage".actor_id);
update "Coverage" set subnational_targets = (select count(distinct "Actor".actor_id) from "Actor" join "Target" on "Actor".actor_id = "Target".actor_id where "Actor".type = 'adm1' and "Actor".is_part_of = "Coverage".actor_id);
update "Coverage" set subnational_population = (select count(distinct "Actor".actor_id) from "Actor" join "Population" on "Actor".actor_id = "Population".actor_id where "Actor".type = 'adm1' and "Actor".is_part_of = "Coverage".actor_id);
update "Coverage" set subnational_gdp = (select count(distinct "Actor".actor_id) from "Actor" join "GDP" on "Actor".actor_id = "GDP".actor_id where "Actor".type = 'adm1' and "Actor".is_part_of = "Coverage".actor_id);

update "Coverage" set city_count = (select count(*) from City_Country where City_Country.country_id = "Coverage".actor_id);

update "Coverage" set city_targets = (select count(distinct city_id) from (City_Country join "Target" on City_Country.city_id = "Target".actor_id) where City_Country.country_id = "Coverage".actor_id);
update "Coverage" set city_emissions = (select count(distinct city_id) from (City_Country join "EmissionsAgg" on City_Country.city_id = "EmissionsAgg".actor_id) where City_Country.country_id = "Coverage".actor_id);
update "Coverage" set city_population = (select count(distinct city_id) from (City_Country join "Population" on City_Country.city_id = "Population".actor_id) where City_Country.country_id = "Coverage".actor_id);
update "Coverage" set city_gdp = (select count(distinct city_id) from (City_Country join "GDP" on City_Country.city_id = "GDP".actor_id) where City_Country.country_id = "Coverage".actor_id);
