// coverage.routes.test.ts -- tests for /api/v1/coverage/* routes

import { app } from "../app";
import request from "supertest";

import { Actor } from "../orm/actor";
import { Publisher } from "../orm/publisher";
import { DataSource } from "../orm/datasource";
import { Target } from "../orm/target";
import { EmissionsAgg } from "../orm/emissionsagg";
import { GDP } from "../orm/gdp";
import { Population } from "../orm/population";
import { Territory } from "../orm/territory";

const disconnect = require("../orm/init").disconnect;

const publisherProps = {
  id: "coverage.routes.test.ts:publisher:1",
  name: "Fake publisher from coverage.routes.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "coverage.routes.testy.ts:datasource:1",
  name: "Fake datasource from coverage.routes.test.ts",
  publisher: publisherProps.id,
  published: new Date(2023, 6, 22),
  citation: "Fake citation",
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "coverage_routes_test_country_1",
  type: "country",
  name: "Test Country",
  datasource_id: datasourceProps.datasource_id,
};

const country2Props = {
  actor_id: "coverage_routes_test_country_2",
  type: "country",
  name: "Test Country 2",
  datasource_id: datasourceProps.datasource_id,
};

const cityProps = {
  actor_id: "coverage_routes_test_city_1",
  type: "city",
  name: "Test City",
  datasource_id: datasourceProps.datasource_id,
};

const city2Props = {
  actor_id: "coverage_routes_test_city_2",
  type: "city",
  name: "Test City 2",
  datasource_id: datasourceProps.datasource_id,
};

const regionProps = {
  actor_id: "coverage_routes_test_region_1",
  type: "adm1",
  name: "Test Region",
  datasource_id: datasourceProps.datasource_id,
};

const region2Props = {
  actor_id: "coverage_routes_test_region_2",
  type: "adm2",
  name: "Test Sub Region",
  datasource_id: datasourceProps.datasource_id,
};

const companyProps = {
  actor_id: "coverage_routes_test_company_1",
  type: "company",
  name: "Test Company",
  datasource_id: datasourceProps.datasource_id,
};

const facilityProps = {
  actor_id: "coverage_routes_test_facility_1",
  type: "site",
  name: "Test Facility",
  datasource_id: datasourceProps.datasource_id,
};

const organizationProps = {
  actor_id: "coverage_routes_test_organization_1",
  type: "organization",
  name: "Test Organization",
  datasource_id: datasourceProps.datasource_id,
}

const actors = [
  countryProps,
  country2Props,
  cityProps,
  city2Props,
  regionProps,
  region2Props,
  companyProps,
  facilityProps,
  organizationProps,
];

let targetCounter = 0;
function makeTarget(actor_id: string) {
  targetCounter++;
  return {
    target_id: "coverage.routes.test.ts:target:" + targetCounter,
    actor_id,
    target_type: "absolute",
    baseline_year: 2015,
    baseline_value: 100000000,
    target_year: 2025,
    target_value: 50000000,
    datasource_id: datasourceProps.datasource_id,
    URL: "https://fake.example/countrytarget1",
    summary: "#1 target by a country to make some changes",
  };
}

const targets = [
  makeTarget(countryProps.actor_id),
  makeTarget(cityProps.actor_id),
  makeTarget(regionProps.actor_id),
];

const emissions = [
  {
    emissions_id: "coverage.routes.test.ts:emissions:1",
    actor_id: countryProps.actor_id,
    year: 2019,
    total_emissions: 100000,
    datasource_id: datasourceProps.datasource_id,
  }, {
    emissions_id: "coverage.routes.test.ts:emissions:2",
    actor_id: cityProps.actor_id,
    year: 2019,
    total_emissions: 100000,
    datasource_id: datasourceProps.datasource_id,
  }, {
    emissions_id: "coverage.routes.test.ts:emissions:3",
    actor_id: regionProps.actor_id,
    year: 2019,
    total_emissions: 100000,
    datasource_id: datasourceProps.datasource_id,
  },
];

const populationProps = {
  actor_id: countryProps.actor_id,
  year: 1984,
  population: 10000000,
  datasource_id: datasourceProps.datasource_id,
};

const gdpProps = {
  actor_id: countryProps.actor_id,
  year: 1984,
  gdp: 1000000000,
  datasource_id: datasourceProps.datasource_id,
};

const territoryProps = {
  actor_id: countryProps.actor_id,
  area: 9984670,
  lat: 624000,
  lng: -964667,
  name: "Fake territory from coverage.routes.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

async function cleanup() {
  const destroyCondition = { where: { datasource_id: datasourceProps.datasource_id } };
  await Target.destroy(destroyCondition);
  await EmissionsAgg.destroy(destroyCondition);
  await Population.destroy(destroyCondition);
  await GDP.destroy(destroyCondition);
  await Territory.destroy(destroyCondition);
  await Actor.destroy(destroyCondition);
  await DataSource.destroy(destroyCondition);
  await Publisher.destroy({ where: { id: publisherProps.id } });
}

beforeAll(async () => {
  await cleanup();
  await Publisher.create(publisherProps);
  await DataSource.create(datasourceProps);
  await Actor.bulkCreate(actors);
  await Target.bulkCreate(targets);
  await EmissionsAgg.bulkCreate(emissions);
  await Population.create(populationProps);
  await GDP.create(gdpProps);
  await Territory.create(territoryProps);
});

afterAll(async () => {
  await cleanup();
  await disconnect();
});

it("returns overall coverage statistics for the data set", async () => {
  return request(app)
    .get(`/api/v1/coverage/stats`)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      if (res.status !== 200) {
        console.error(JSON.stringify(res.body, null, 2));
        return;
      }
      expect(typeof res.body).toEqual("object");
      expect(res.body).toEqual({
        "number_of_data_sources": 1,
        "number_of_countries": 2,
        "number_of_regions": 2,
        "number_of_cities": 2,
        "number_of_companies": 1,
        "number_of_facilities": 1,
        "number_of_emissions_records": 3,
        "number_of_target_records": 3,
        "number_of_contextual_records": 4,
        "number_of_countries_with_emissions": 1,
        "number_of_countries_with_targets": 1,
        "number_of_regions_with_emissions": 1,
        "number_of_regions_with_targets": 1,
        "number_of_cities_with_emissions": 1,
        "number_of_cities_with_targets": 1,
      });
    })
    .expect(200);
})

