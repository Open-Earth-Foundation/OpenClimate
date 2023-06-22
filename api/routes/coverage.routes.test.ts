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

const actors = [countryProps];

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
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(typeof res.body).toEqual(Object);
      expect(res.body).toEqual({
        number_of_cities: 1,
      });
    });
})

