// actor.test.ts -- tests for ORM Actor

import { Actor } from "./actor";
import { DataSource } from "./datasource";
import { Publisher } from "./publisher";
const disconnect = require("./init").disconnect;
const DNE = "actor.test.ts:actor:does-not-exist"

const publisherProps = {
  id: "actor.test.ts:publisher:1",
  name: "Fake publisher from actor.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "actor.test.ts:datasource:1",
  name: "Fake datasource from actor.test.ts",
  publisher: publisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "actor.test.ts:actor:country:1",
  type: "country",
  name: "Fake country actor from actor.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

const regionProps = {
  actor_id: "actor.test.ts:actor:region:1",
  type: "adm1",
  name: "Fake region actor from actor.test.ts",
  is_part_of: countryProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

// For Path investigations

const country2Props = {
  actor_id: "actor.test.ts:actor:country:2",
  type: "country",
  name: "Fake country actor 2 from actor.test.ts",
  datasource_id: datasourceProps.datasource_id,
  is_part_of: "EARTH",
};

const region2Props = {
  actor_id: "actor.test.ts:actor:region:2",
  type: "adm1",
  name: "Fake region actor 2 from actor.test.ts",
  is_part_of: country2Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region3Props = {
  actor_id: "actor.test.ts:actor:region:3",
  type: "adm2",
  name: "Fake region actor 3 from actor.test.ts",
  is_part_of: region2Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city1Props = {
  actor_id: "actor.test.ts:actor:city:1",
  type: "city",
  name: "Fake city actor 1 from actor.test.ts",
  is_part_of: region3Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region4Props = {
  actor_id: "actor.test.ts:actor:region:4",
  type: "adm1",
  name: "Fake region actor 4 from actor.test.ts",
  is_part_of: country2Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city2Props = {
  actor_id: "actor.test.ts:actor:city:2",
  type: "city",
  name: "Fake city actor 2 from actor.test.ts",
  is_part_of: region4Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const UPDATED_NAME = "Updated region name from actor.test.ts";

const cleanup = async () => {
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
});

afterAll(async () => {
  // Clean up if there were failed tests

  await cleanup();

  // Close database connections

  await disconnect();
});

it("can CRUD related actors", async () => {
  let country = await Actor.create(countryProps);
  expect(country.name).toEqual(countryProps.name);

  country = await Actor.findByPk(countryProps.actor_id);
  expect(country.name).toEqual(countryProps.name);

  let region = await Actor.create(regionProps);
  expect(region.name).toEqual(regionProps.name);

  region = await Actor.findByPk(regionProps.actor_id);
  expect(region.name).toEqual(regionProps.name);
  expect(region.is_part_of).toEqual(country.actor_id);

  region.name = UPDATED_NAME;

  await region.save();

  region = await Actor.findByPk(regionProps.actor_id);
  expect(region.name).toEqual(UPDATED_NAME);

  await region.destroy();

  let matches = await Actor.findAll({
    where: { actor_id: regionProps.actor_id },
  });
  expect(matches.length).toEqual(0);

  await country.destroy();

  matches = await Actor.findAll({ where: { actor_id: countryProps.actor_id } });
  expect(matches.length).toEqual(0);
});

it("can get paths", async () => {

  // Set up the paths

  // Make sure it returns and empty path for actors that don't exist

  let empty = await Actor.path(DNE)

  expect(empty).toBeDefined()
  expect(empty.length).toBeDefined()
  expect(empty.length).toEqual(0)

  // evanp: I'd put this in the beforeAll() but since this suite also
  // includes CRUD I figure it should go here.

  await Actor.create(country2Props);
  await Promise.all([Actor.create(region2Props), Actor.create(region4Props)]);
  await Actor.create(region3Props);
  await Promise.all([Actor.create(city1Props), Actor.create(city2Props)]);

  let path = await Actor.path(city1Props.actor_id);
  expect(path.length).toBeDefined();
  expect(path.length).toEqual(5); // city, adm2, adm1, country, planet
  expect(path[0].actor_id).toEqual(city1Props.actor_id);
  expect(path[1].actor_id).toEqual(region3Props.actor_id);
  expect(path[2].actor_id).toEqual(region2Props.actor_id);
  expect(path[3].actor_id).toEqual(country2Props.actor_id);
  expect(path[4].actor_id).toEqual("EARTH");

  let paths = await Actor.paths([city1Props.actor_id, city2Props.actor_id]);

  expect(paths.length).toBeDefined();
  expect(paths.length).toEqual(2);

  expect(paths[0].length).toEqual(5); // city, adm2, adm1, country, planet
  expect(paths[0][0].actor_id).toEqual(city1Props.actor_id);
  expect(paths[0][1].actor_id).toEqual(region3Props.actor_id);
  expect(paths[0][2].actor_id).toEqual(region2Props.actor_id);
  expect(paths[0][3].actor_id).toEqual(country2Props.actor_id);
  expect(paths[0][4].actor_id).toEqual("EARTH");

  expect(paths[1].length).toEqual(4); // city, adm1, country, planet
  expect(paths[1][0].actor_id).toEqual(city2Props.actor_id);
  expect(paths[1][1].actor_id).toEqual(region4Props.actor_id);
  expect(paths[1][2].actor_id).toEqual(country2Props.actor_id);
  expect(paths[1][3].actor_id).toEqual("EARTH");

  // evanp: the created actors should get reaped in the cleanup() function
  // run afterAll()
});
