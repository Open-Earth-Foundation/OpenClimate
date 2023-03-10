// target.test.ts -- tests for ORM Target

import { Actor } from "./actor";
import { DataSource } from "./datasource";
import { Publisher } from "./publisher";
import { Target } from "./target";
import { Initiative } from "./initiative";
import { DataSourceQuality } from "./datasourcequality";
import { EmissionsAgg } from './emissionsagg';

const disconnect = require("./init").disconnect;

const publisherProps = {
  id: "target.test.ts:publisher:1",
  name: "Fake publisher from target.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "target.test.ts:datasource:1",
  name: "Fake datasource from target.test.ts",
  publisher: publisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "target.test.ts:actor:country:1",
  type: "country",
  name: "Fake country actor from target.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

const regionProps = {
  actor_id: "target.test.ts:actor:region:1",
  type: "adm1",
  name: "Fake region actor from target.test.ts",
  is_part_of: countryProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

// Different targets in different years

const countryTarget1Props = {
  target_id: "target.test.ts:target:1",
  actor_id: countryProps.actor_id,
  target_type: "absolute",
  baseline_year: 2015,
  baseline_value: 100000000,
  target_year: 2025,
  target_value: 50000000,
  datasource_id: datasourceProps.datasource_id,
  URL: "https://fake.example/countrytarget1",
  summary: "#1 target by a country to make some changes",
};

const countryTarget2Props = {
  target_id: "target.test.ts:target:2",
  actor_id: countryProps.actor_id,
  target_type: "percent",
  baseline_year: 2020,
  baseline_value: 100000000,
  target_year: 2030,
  target_value: 75,
  target_unit: "percent",
  datasource_id: datasourceProps.datasource_id,
  URL: "https://fake.example/countrytarget2",
  summary: "#1 target by a country to make some changes",
};

const countryTarget3Props = {
  target_id: "target.test.ts:country:1:target:3",
  actor_id: countryProps.actor_id,
  target_type: "Net zero",
  target_year: 2050,
  datasource_id: datasourceProps.datasource_id
};

// Different actor, different identifiers

const regionTarget1Props = {
  target_id: "target.test.ts:target:3",
  actor_id: regionProps.actor_id,
  target_type: "percent",
  baseline_year: 2022,
  baseline_value: 10000000,
  target_year: 2030,
  target_value: 75,
  target_unit: "percent",
  datasource_id: datasourceProps.datasource_id,
  URL: "https://fake.example/regiontarget3",
  summary: "#3 target by a region to make some changes",
};

// With an initiative

const region2Props = {
  actor_id: "target.test.ts:actor:region:2",
  type: "adm1",
  name: "Fake region actor from target.test.ts",
  is_part_of: countryProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const initiativeProps = {
  initiative_id: "target.test.ts:initiative:1",
  name: "Fake initiative from target.test.ts",
  description: "This initiative is fake",
  URL: "https://fake.example/datasource",
  datasource_id: datasourceProps.datasource_id,
};

const initiativeTargetProps = {
  target_id: "target.test.ts:target:4",
  actor_id: region2Props.actor_id,
  target_type: "percent",
  baseline_year: 2022,
  baseline_value: 10000000,
  target_year: 2030,
  target_value: 75,
  target_unit: "percent",
  datasource_id: datasourceProps.datasource_id,
  URL: "https://fake.example/regiontarget4",
  summary: "#4 target by a region to make some changes",
  initiative_id: initiativeProps.initiative_id,
};

// Getting target completion percentage

const country4Props = {
  actor_id: "target.test.ts:actor:country:4",
  type: "country",
  name: "Fake country actor from target.test.ts",
  is_part_of: 'EARTH',
  datasource_id: datasourceProps.datasource_id,
};

const country4Target1Props = {
  target_id: "target.test.ts:country:4:target:1",
  actor_id: country4Props.actor_id,
  target_type: 'Absolute emission reduction',
  baseline_year: 2005,
  baseline_value: 10000000,
  target_year: 2035,
  target_value: 75,
  target_unit: "percent",
  datasource_id: datasourceProps.datasource_id
};

const country4Target2Props = {
  target_id: "target.test.ts:country:4:target:2",
  actor_id: country4Props.actor_id,
  target_type: 'Carbon intensity reduction',
  baseline_year: 2005,
  baseline_value: 420,
  target_year: 2035,
  target_value: 69,
  target_unit: "percent",
  datasource_id: datasourceProps.datasource_id
};

const country4Target3Props = {
  target_id: "target.test.ts:country:4:target:3",
  actor_id: country4Props.actor_id,
  target_type: 'Absolute emission reduction',
  baseline_year: 2005,
  target_year: 2035,
  target_value: 75,
  target_unit: "percent",
  datasource_id: datasourceProps.datasource_id
};

const country4Emissions1Props = {
  emissions_id: "target.test.ts:country:4:emissions:1",
  actor_id: country4Props.actor_id,
  year: 2005,
  total_emissions: 10000000,
  datasource_id: datasourceProps.datasource_id
};

const country4Emissions2Props = {
  emissions_id: "target.test.ts:country:4:emissions:2",
  actor_id: country4Props.actor_id,
  year: 2021,
  total_emissions: 6000000,
  datasource_id: datasourceProps.datasource_id
};

const dataSourceQualityProps = {
  datasource_id: datasourceProps.datasource_id,
  score_type: 'GHG target',
  score: 0.9
}

async function cleanup() {
  await Target.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await Initiative.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await EmissionsAgg.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await Actor.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await DataSourceQuality.destroy({
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
  await DataSourceQuality.create(dataSourceQualityProps);
  await Actor.create(countryProps);
  await Actor.create(country4Props);
  await Actor.create(regionProps);
  await Actor.create(region2Props);
  await Initiative.create(initiativeProps);
});

afterAll(async () => {
  // Clean up if there were failed tests

  await cleanup();

  // Close database connections

  await disconnect();
});

it("can create and get targets", async () => {
  let [c1, c2, c3, r1] = await Promise.all([
    Target.create(countryTarget1Props),
    Target.create(countryTarget2Props),
    Target.create(countryTarget3Props),
    Target.create(regionTarget1Props),
  ]);

  // Match on primary key

  let match = await Target.findByPk(countryTarget1Props.target_id);

  expect(match.actor_id).toEqual(countryTarget1Props.actor_id);

  expect(match.URL).toBeDefined();
  expect(typeof match.URL).toEqual("string");

  expect(match.summary).toBeDefined();
  expect(typeof match.summary).toEqual("string");

  expect(match.isNetZero()).toBeFalsy()

  // Match netzero by pk

  let nz = await Target.findByPk(countryTarget3Props.target_id);

  expect(nz.isNetZero()).toBeTruthy()

  // Match on Actor

  let matches = await Target.findAll({
    where: {
      actor_id: countryProps.actor_id,
    },
  });

  expect(matches.length).toEqual(3);

  // Destroy all targets

  await Promise.all([c1.destroy(), c2.destroy(), c3.destroy(), r1.destroy()]);
});

it("can create and get a target with associated initiative", async () => {
  let target = await Target.create(initiativeTargetProps);

  // Match on primary key

  let match = await Target.findByPk(initiativeTargetProps.target_id);

  expect(match.initiative_id).toBeDefined();
  expect(typeof match.initiative_id).toEqual("string");
  expect(match.initiative_id).toEqual(initiativeTargetProps.initiative_id);

  // Match on initiative ID

  let matches = await Target.findAll({
    where: {
      initiative_id: initiativeProps.initiative_id,
    },
  });

  expect(matches.length).toEqual(1);

  await target.destroy();

  // Match on initiative ID

  matches = await Target.findAll({
    where: {
      initiative_id: initiativeProps.initiative_id,
    },
  });

  expect(matches.length).toEqual(0);
});

it("can get completion percentage on relevant targets", async () => {

  let [t1, t2, t3, ea1, ea2] = await Promise.all([
    Target.create(country4Target1Props),
    Target.create(country4Target2Props),
    Target.create(country4Target3Props),
    EmissionsAgg.create(country4Emissions1Props),
    EmissionsAgg.create(country4Emissions2Props)
  ])

  let complete1 = await t1.getPercentComplete()
  expect(typeof complete1).toEqual('number')
  expect(complete1).toBeCloseTo(53.333)

  let complete2 = await t2.getPercentComplete()
  expect(complete2).toBeNull()

  let complete3 = await t3.getPercentComplete()
  expect(typeof complete3).toEqual('number')
  expect(complete3).toBeCloseTo(53.333)

  await Promise.all([
    t1.destroy(), t2.destroy(), t3.destroy(), ea1.destroy(), ea2.destroy()
  ])
})
