// publisher.test.ts - test Publisher ORM

import { Publisher } from "./publisher";
const disconnect = require("./init").disconnect;

// Fake publisher props

const props = {
  id: "publisher.test.ts:1",
  name: "Fake publisher from tests",
  URL: "https://fake.example/",
};

const URL2 = "https://fake2.example";

// Cleanup any fake publishers

beforeAll(async () => {
  return Publisher.destroy({ where: { id: props.id } });
});

// Cleanup any fake publishers and close the connection

afterAll(async () => {
  await Publisher.destroy({ where: { id: props.id } });
  return disconnect();
});

it("can create, read, update and delete a Publisher", async () => {
  let createP = await Publisher.create(props);
  expect(createP.name).toEqual(props.name);

  let readP = await Publisher.findByPk(props.id);
  expect(readP.URL).toEqual(props.URL);

  readP.URL = URL2;
  let savedP = await readP.save();

  let readAgainP = await Publisher.findByPk(props.id);
  expect(readAgainP.URL).toEqual(URL2);

  await readAgainP.destroy();

  let allMatch = await Publisher.findAll({ where: { id: props.id } });
  expect(allMatch.length).toEqual(0);
});
