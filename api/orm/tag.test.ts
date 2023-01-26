// tag.test.ts - test Tag ORM

import { Tag } from "./tag";
const disconnect = require("./init").disconnect;

const props1 = {
  tag_id: "tag_test_ts_1",
  tag_name: "A tag from the tag.test.ts unit test",
};

const props2 = {
  tag_id: "tag_test_ts_2",
  tag_name: "A tag from the tag.test.ts unit test",
};

async function cleanup() {
  return Promise.all([
    Tag.destroy({ where: { tag_id: props1.tag_id } }),
    Tag.destroy({ where: { tag_id: props2.tag_id } }),
  ]);
}

beforeAll(async () => {
  // Cleanup any fake tags

  await cleanup();
});

// Cleanup fake datasources and close the connection

afterAll(async () => {
  // Cleanup any fake tags

  await cleanup();

  await disconnect();
});

it("can CRUD tags", async () => {
  let tag1 = await Tag.create(props1);
  let tag2 = await Tag.create(props2);

  expect(tag1.tag_id).toEqual(props1.tag_id);
  expect(tag1.tag_name).toEqual(props1.tag_name);

  expect(tag2.tag_id).toEqual(props2.tag_id);
  expect(tag2.tag_name).toEqual(props2.tag_name);

  let match = await Tag.findByPk(props1.tag_id);

  expect(match.tag_name).toEqual(props1.tag_name);

  let matches = await Tag.findAll({ where: { tag_id: props1.tag_id } });

  expect(matches.length).toEqual(1);

  await tag1.destroy();

  matches = await Tag.findAll({ where: { tag_id: props1.tag_id } });

  expect(matches.length).toEqual(0);

  matches = await Tag.findAll({ where: { tag_id: props2.tag_id } });

  expect(matches.length).toEqual(1);

  await tag2.destroy();

  matches = await Tag.findAll({ where: { tag_id: props2.tag_id } });

  expect(matches.length).toEqual(0);
});
