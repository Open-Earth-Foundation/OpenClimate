// latestpopulation.test.ts -- tests for ORM LatestPopulation

import { Publisher } from "./publisher";
import { DataSource } from "./datasource";
import { Actor } from "./actor";
import { LatestPopulation } from "./latestpopulation";
const disconnect = require("./init").disconnect;

const publisherProps = {
  id: "latestpopulation.test.ts:publisher:1",
  name: "Fake publisher from latestpopulation.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "latestpopulation.test.ts:datasource:1",
  name: "Fake datasource from latestpopulation.test.ts",
  publisher: publisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "latestpopulation.test.ts:actor:1",
  type: "country",
  name: "Fake country actor from latestpopulation.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

const regionProps = {
  actor_id: "latestpopulation.test.ts:actor:2",
  type: "adm1",
  name: "Fake region actor from latestpopulation.test.ts",
  is_part_of: countryProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

async function cleanup() {
  // Clean up if there were failed tests

  await LatestPopulation.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
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

  // Create referenced rows

  await Publisher.create(publisherProps);
  await DataSource.create(datasourceProps);
  await Actor.create(countryProps);
  await Actor.create(regionProps);
});

afterAll(async () => {
  await cleanup();

  // Close database connections

  await disconnect();
});

it("can create and get LatestPopulation series", async () => {
  // Create latestpopulation for country and region

  await LatestPopulation.create({
    actor_id: countryProps.actor_id,
    year: 2023,
    population: 10000000,
    datasource_id: datasourceProps.datasource_id,
  });

  await LatestPopulation.create({
    actor_id: regionProps.actor_id,
    year: 2021,
    population: 1000000,
    datasource_id: datasourceProps.datasource_id,
  });

  // Match on Actor

  let matches = await LatestPopulation.findAll({
    where: {
      actor_id: countryProps.actor_id,
    },
  });

  expect(matches.length).toEqual(1);
  expect(matches[0].year).toEqual(2023);
  expect(matches[0].population).toEqual("10000000");

  await LatestPopulation.destroy({
    where: { actor_id: countryProps.actor_id },
  });

  matches = await LatestPopulation.findAll({
    where: {
      actor_id: countryProps.actor_id,
    },
  });

  expect(matches.length).toEqual(0);

  await LatestPopulation.destroy({ where: { actor_id: regionProps.actor_id } });
});
