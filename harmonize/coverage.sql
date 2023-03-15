/* coverage.sql */

create temp table "City" as select * from "Actor" where type = 'city';
create unique index on "City"("actor_id");
create temp table "Country" as select * from "Actor" where type = 'country';
create unique index on "Country"("actor_id");
create temp table "Region" as select * from "Actor" where type in ('adm1', 'adm2');
create unique index on "Region"("actor_id");

create temp table "Region_Country" as
    select "Region".actor_id as region_id, "Country".actor_id as country_id from "Region" join "Country" on "Region".is_part_of = "Country".actor_id
    union
    select r2.actor_id as region_id, "Country".actor_id as country_id from ("Region" r2 join "Region" r1 on r2.is_part_of = r1.actor_id) join "Country" on r1.is_part_of = "Country".actor_id;

create unique index on "Region_Country"("region_id");
create index on "Region_Country"("region_id");

create temp table "City_Country" as
    select "City".actor_id as city_id, "Country".actor_id as country_id from ("City" join "Region_Country" on "City".is_part_of = "Region_Country".region_id) join "Country" on "Region_Country".country_id = "Country".actor_id
    union
    select "City".actor_id as city_id, "Country".actor_id as country_id from "City" join "Country" on "City".is_part_of = "Country".actor_id;

create unique index on "City_Country"("city_id");
create index on "City_Country"("country_id");

create temp table "Latest_Population" as select actor_id, "year", "population" from "Population" where "year" = (select max(year) from "Population" p where p.actor_id = "Population".actor_id);
create unique index on "Latest_Population"("actor_id");

create temp table "Latest_GDP" as select actor_id, "year", "gdp" from "GDP" where "year" = (select max(year) from "GDP" g where g.actor_id = "GDP".actor_id);
create unique index on "Latest_GDP"("actor_id");

create temp table if not exists "Coverage" (
    actor_id varchar(255),
    country_emissions int,
    country_targets int,
    country_population int,
    country_gdp int,
    country_territory int,
    country_population_value int,
    country_gdp_value bigint,
    country_area int,
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
    city_territory int,
    PRIMARY KEY ("actor_id")
);

insert into "Coverage" select actor_id from "Actor" where type = 'country' and not exists (select actor_id from "Coverage" where "Coverage".actor_id = "Actor".actor_id);

update "Coverage" set country_emissions = (select count(distinct actor_id) from "EmissionsAgg" where "EmissionsAgg".actor_id = "Coverage".actor_id);
update "Coverage" set country_targets = (select count(distinct actor_id) from "Target" where "Target".actor_id = "Coverage".actor_id);
update "Coverage" set country_population = (select count(distinct actor_id) from "Population" where "Population".actor_id = "Coverage".actor_id);
update "Coverage" set country_gdp = (select count(distinct actor_id) from "GDP" where "GDP".actor_id = "Coverage".actor_id);
update "Coverage" set country_territory = (select count(distinct actor_id) from "Territory" where "Territory".actor_id = "Coverage".actor_id);
update "Coverage" set country_population_value = (select "population" from "Latest_Population" where "Latest_Population".actor_id = "Coverage".actor_id);
update "Coverage" set country_gdp_value = (select gdp from "Latest_GDP" where "Latest_GDP".actor_id = "Coverage".actor_id);
update "Coverage" set country_area = (select area from "Territory" where "Territory".actor_id = "Coverage".actor_id);

update "Coverage" set subnational_count = (select count(distinct region_id) from "Region_Country" where "Region_Country".country_id = "Coverage".actor_id);
update "Coverage" set subnational_emissions = (select count(distinct "Region_Country".region_id) from "Region_Country" join "EmissionsAgg" on "Region_Country".region_id = "EmissionsAgg".actor_id where "Region_Country".country_id = "Coverage".actor_id);
update "Coverage" set subnational_targets = (select count(distinct "Region_Country".region_id) from "Region_Country" join "Target" on "Region_Country".region_id = "Target".actor_id where "Region_Country".country_id = "Coverage".actor_id);
update "Coverage" set subnational_population = (select count(distinct "Region_Country".region_id) from "Region_Country" join "Population" on "Region_Country".region_id = "Population".actor_id where "Region_Country".country_id = "Coverage".actor_id);
update "Coverage" set subnational_gdp = (select count(distinct "Region_Country".region_id) from "Region_Country" join "GDP" on "Region_Country".region_id = "GDP".actor_id where "Region_Country".country_id = "Coverage".actor_id);
update "Coverage" set subnational_territory = (select count(distinct region_id) from ("Region_Country" join "Territory" on "Region_Country".region_id = "Territory".actor_id) where "Region_Country".country_id = "Coverage".actor_id);

update "Coverage" set city_count = (select count(*) from "City_Country" where "City_Country".country_id = "Coverage".actor_id);

update "Coverage" set city_targets = (select count(distinct city_id) from ("City_Country" join "Target" on "City_Country".city_id = "Target".actor_id) where "City_Country".country_id = "Coverage".actor_id);
update "Coverage" set city_emissions = (select count(distinct city_id) from ("City_Country" join "EmissionsAgg" on "City_Country".city_id = "EmissionsAgg".actor_id) where "City_Country".country_id = "Coverage".actor_id);
update "Coverage" set city_population = (select count(distinct city_id) from ("City_Country" join "Population" on "City_Country".city_id = "Population".actor_id) where "City_Country".country_id = "Coverage".actor_id);
update "Coverage" set city_gdp = (select count(distinct city_id) from ("City_Country" join "GDP" on "City_Country".city_id = "GDP".actor_id) where "City_Country".country_id = "Coverage".actor_id);
update "Coverage" set city_territory = (select count(distinct city_id) from ("City_Country" join "Territory" on "City_Country".city_id = "Territory".actor_id) where "City_Country".country_id = "Coverage".actor_id);
