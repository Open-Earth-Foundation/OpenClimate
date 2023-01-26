// emissionsaggtag.test.ts -- tests for ORM Actor

import { Actor } from "./actor";
import { DataSource } from "./datasource";
import { Publisher } from "./publisher";
import { EmissionsAgg } from "./emissionsagg";
import { Tag } from "./tag";
import { EmissionsAggTag } from "./emissionsaggtag";

const disconnect = require("./init").disconnect;

const publisherProps = {
  id: "emissionsaggtag.test.ts:publisher:1",
  name: "Fake geo publisher from emissionsaggtag.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "emissionsaggtag.test.ts:datasource:1",
  name: "Fake geo datasource from emissionsaggtag.test.ts",
  publisher: publisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "emissionsaggtag.test.ts:actor:country:1",
  type: "country",
  name: "Fake country actor from emissionsaggtag.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

// Different emissions for same actor

const countryEmissions1Props = {
  emissions_id: "emissionsaggtag.test.ts:emissions:1",
  actor_id: countryProps.actor_id,
  year: 2019,
  total_emissions: 100000,
  datasource_id: datasourceProps.datasource_id,
};

const countryEmissions2Props = {
  emissions_id: "emissionsaggtag.test.ts:emissions:2",
  actor_id: countryProps.actor_id,
  year: 2020,
  total_emissions: 100000,
  datasource_id: datasourceProps.datasource_id,
};

const tag1 = {
  tag_id: "emissionsaggtag_test_ts_1",
  tag_name: "First fake tag for emissionsaggtag.test.ts",
};

const tag2 = {
  tag_id: "emissionsaggtag_test_ts_2",
  tag_name: "Second fake tag for emissionsaggtag.test.ts",
};

async function cleanup() {
  await Tag.destroy({ where: { tag_id: tag1.tag_id } });
  await Tag.destroy({ where: { tag_id: tag2.tag_id } });

  await EmissionsAgg.destroy({
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
  // Clean up if there were failed tests

  await cleanup();

  // Create referenced rows

  await Publisher.create(publisherProps);

  await DataSource.create(datasourceProps);

  await Actor.create(countryProps);

  await Promise.all([
    EmissionsAgg.create(countryEmissions1Props),
    EmissionsAgg.create(countryEmissions2Props),
    Tag.create(tag1),
    Tag.create(tag2),
  ]);
});

afterAll(async () => {
  // Clean up if there were failed tests

  await cleanup();

  // Close database connections

  await disconnect();
});

it("can create and get EmissionsAgg", async () => {
  for (let tag of [tag1, tag2]) {
    for (let ea of [countryEmissions1Props, countryEmissions2Props]) {
      await EmissionsAggTag.create({
        emissions_id: ea.emissions_id,
        tag_id: tag.tag_id,
      });
    }
  }

  let match = await EmissionsAggTag.findOne({
    where: {
      tag_id: tag1.tag_id,
      emissions_id: countryEmissions1Props.emissions_id,
    },
  });

  expect(match.tag_id).toEqual(tag1.tag_id);
  expect(match.emissions_id).toEqual(countryEmissions1Props.emissions_id);
  expect(match.created).toBeDefined();
  expect(match.last_updated).toBeDefined();

  let matches = await EmissionsAggTag.findAll({
    where: { tag_id: tag1.tag_id },
  });

  expect(matches.length).toEqual(2);

  matches = await EmissionsAggTag.findAll({
    where: { emissions_id: countryEmissions1Props.emissions_id },
  });

  expect(matches.length).toEqual(2);

  await match.destroy();

  matches = await EmissionsAggTag.findAll({ where: { tag_id: tag1.tag_id } });

  expect(matches.length).toEqual(1);

  matches = await EmissionsAggTag.findAll({
    where: { emissions_id: countryEmissions1Props.emissions_id },
  });

  expect(matches.length).toEqual(1);

  await EmissionsAggTag.destroy({
    where: { emissions_id: countryEmissions1Props.emissions_id },
  });

  matches = await EmissionsAggTag.findAll({
    where: { emissions_id: countryEmissions1Props.emissions_id },
  });

  expect(matches.length).toEqual(0);

  matches = await EmissionsAggTag.findAll({
    where: { emissions_id: countryEmissions2Props.emissions_id },
  });

  expect(matches.length).toEqual(2);

  await EmissionsAggTag.destroy({
    where: { emissions_id: countryEmissions2Props.emissions_id },
  });

  matches = await EmissionsAggTag.findAll({
    where: { emissions_id: countryEmissions2Props.emissions_id },
  });

  expect(matches.length).toEqual(0);
});
