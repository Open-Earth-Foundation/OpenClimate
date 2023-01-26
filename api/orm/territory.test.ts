// territory.test.ts -- tests for ORM Territory

import { Publisher } from "./publisher";
import { DataSource } from "./datasource";
import { Actor } from "./actor";
import { Territory } from "./territory";
const disconnect = require("./init").disconnect;

const publisherProps = {
  id: "territory.test.ts:publisher:1",
  name: "Fake publisher from territory.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "territory.test.ts:datasource:1",
  name: "Fake datasource from territory.test.ts",
  publisher: publisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "territory.test.ts:actor:1",
  type: "country",
  name: "Fake country actor from territory.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

const territoryProps = {
  actor_id: countryProps.actor_id,
  area: 9984670,
  lat: 624000,
  lng: -964667,
  name: "Fake territory from territory.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

async function cleanup() {
  // Clean up if there were failed tests

  await Territory.destroy({
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
});

afterAll(async () => {
  await cleanup();

  // Close database connections

  await disconnect();
});

it("can create and get Territory", async () => {
  let t = await Territory.create(territoryProps);

  // Match on namespace and identifier

  let match = await Territory.findByPk(countryProps.actor_id);

  expect(match.actor_id).toEqual(t.actor_id);
  expect(match.area).toEqual(t.area);
  expect(match.lat).toEqual(t.lat);
  expect(match.lng).toEqual(t.lng);

  // Match on Actor

  let matches = await Territory.findAll({
    where: {
      actor_id: countryProps.actor_id,
    },
  });

  expect(matches.length).toEqual(1);

  await t.destroy();

  matches = await Territory.findAll({
    where: {
      actor_id: countryProps.actor_id,
    },
  });

  expect(matches.length).toEqual(0);
});
