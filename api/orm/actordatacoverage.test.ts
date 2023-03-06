// actordatacoverage.test.ts -- tests for ORM ActorDataCoverage

import { Actor } from "./actor";
import { DataSource } from "./datasource";
import { Publisher } from "./publisher";
import { ActorDataCoverage } from "./actordatacoverage";

const disconnect = require("./init").disconnect;

const publisherProps = {
  id: "actordatacoverage.test.ts:publisher:1",
  name: "Fake publisher from actordatacoverage.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "actordatacoverage.test.ts:datasource:1",
  name: "Fake datasource from actordatacoverage.test.ts",
  publisher: publisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "actordatacoverage.test.ts:actor:country:1",
  type: "country",
  name: "Fake country actor from actordatacoverage.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

const regionProps = {
  actor_id: "actordatacoverage.test.ts:actor:region:1",
  type: "adm1",
  name: "Fake region actor from actordatacoverage.test.ts",
  is_part_of: countryProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const cityProps = {
  actor_id: "actordatacoverage.test.ts:actor:city:1",
  type: "city",
  name: "Fake city actor from actordatacoverage.test.ts",
  is_part_of: regionProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const countryCoverageProps = {
  actor_id: countryProps.actor_id,
  has_data: true,
  has_children: true,
  children_have_data: true,
};

const regionCoverageProps = {
  actor_id: regionProps.actor_id,
  has_data: true,
  has_children: true,
  children_have_data: false,
};

const cityCoverageProps = {
  actor_id: cityProps.actor_id,
  has_data: false,
  has_children: false,
  children_have_data: null,
};

const cleanup = async () => {
  await Promise.all([
    ActorDataCoverage.destroy({
      where: { actor_id: countryCoverageProps.actor_id },
    }),
    ActorDataCoverage.destroy({
      where: { actor_id: regionCoverageProps.actor_id },
    }),
    ActorDataCoverage.destroy({
      where: { actor_id: cityCoverageProps.actor_id },
    }),
  ]);

  await Actor.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await Publisher.destroy({ where: { id: publisherProps.id } });
};

beforeAll(async () => {
  // Clean up if there were failed tests

  await cleanup();

  // Create referenced rows

  await Publisher.create(publisherProps);
  await DataSource.create(datasourceProps);
  await Actor.create(countryProps);
  await Actor.create(regionProps);
  await Actor.create(cityProps);
});

afterAll(async () => {
  await cleanup();

  // Close database connections

  await disconnect();
});

it("can create and get ActorDataCoverage data", async () => {
  await Promise.all([
    ActorDataCoverage.create(countryCoverageProps),
    ActorDataCoverage.create(regionCoverageProps),
    ActorDataCoverage.create(cityCoverageProps),
  ]);

  // Match on actor_id

  let match = await ActorDataCoverage.findOne({
    where: {
      actor_id: countryProps.actor_id,
    },
  });

  expect(match.actor_id).toEqual(countryCoverageProps.actor_id);
  expect(match.has_data).toBeTruthy();
  expect(match.has_children).toBeTruthy();
  expect(match.children_have_data).toBeTruthy();

  // Match on actor_id for region

  match = await ActorDataCoverage.findOne({
    where: {
      actor_id: regionProps.actor_id,
    },
  });

  expect(match.actor_id).toEqual(regionCoverageProps.actor_id);
  expect(match.has_data).toBeTruthy();
  expect(match.has_children).toBeTruthy();
  expect(match.children_have_data).toBeFalsy();

  // Match on actor_id for city

  match = await ActorDataCoverage.findOne({
    where: {
      actor_id: cityProps.actor_id,
    },
  });

  expect(match.actor_id).toEqual(cityCoverageProps.actor_id);
  expect(match.has_data).toBeFalsy();
  expect(match.has_children).toBeFalsy();
  expect(match.children_have_data).toBeNull();

  // Destroy all

  await Promise.all([
    ActorDataCoverage.destroy({
      where: { actor_id: countryCoverageProps.actor_id },
    }),
    ActorDataCoverage.destroy({
      where: { actor_id: regionCoverageProps.actor_id },
    }),
    ActorDataCoverage.destroy({
      where: { actor_id: cityCoverageProps.actor_id },
    }),
  ]);

  // Match on actor_id

  let matches = await ActorDataCoverage.findAll({
    where: {
      actor_id: countryProps.actor_id,
    },
  });

  expect(matches.length).toEqual(0);
});
