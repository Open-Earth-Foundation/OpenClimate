// coverage.routes.test.ts -- tests for /api/v1/coverage/* routes

import { app } from "../app";
import request from "supertest";

import { Actor } from "../orm/actor";
import { Publisher } from "../orm/publisher";
import { DataSource } from "../orm/datasource";

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

const cityProps = {
  actor_id: "coverage_routes_test_city_1",
  type: "city",
  name: "Test City",
  datasource_id: datasourceProps.datasource_id,
};

const region1Props = {
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

const actors = [countryProps, cityProps, region1Props, region2Props, companyProps];

async function cleanup() {
  await Actor.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await Publisher.destroy({ where: { id: publisherProps.id } });
}

beforeAll(async () => {
  await cleanup();
  await Publisher.create(publisherProps);
  await DataSource.create(datasourceProps);
  for (const props of actors) {
    await Actor.create(props);
  }
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
        "number_of_contextual_records": 3,
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

