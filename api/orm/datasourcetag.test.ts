// datasourcetag.test.ts - test DataSource ORM

import { DataSource } from "./datasource";
import { Publisher } from "./publisher";
import { Tag } from "./tag";
import { DataSourceTag } from "./datasourcetag";

const disconnect = require("./init").disconnect;

// Fake datasource props

const publisher = {
  id: "datasourcetag.test.ts:publisher:1",
  name: "Fake publisher from datasourcetag.test.ts",
  URL: "https://fake.example/publisher",
};

const datasource1 = {
  datasource_id: "datasourcetag.test.ts:datasource:1",
  name: "Fake datasource from datasourcetag.test.ts",
  URL: "https://fake.example/datasource",
  publisher: publisher.id,
  published: new Date(2022, 10, 12),
};

const datasource2 = {
  datasource_id: "datasourcetag.test.ts:datasource:2",
  name: "Fake datasource from datasourcetag.test.ts",
  URL: "https://fake.example/datasource",
  publisher: publisher.id,
  published: new Date(2022, 10, 12),
};

const tag1 = {
  tag_id: "datasourcetag_test_ts_1",
  tag_name: "First fake tag for datasourcetag.test.ts",
};

const tag2 = {
  tag_id: "datasourcetag_test_ts_2",
  tag_name: "Second fake tag for datasourcetag.test.ts",
};

async function cleanup() {
  await Promise.all([
    DataSourceTag.destroy({ where: { tag_id: tag1.tag_id } }),
    DataSourceTag.destroy({ where: { tag_id: tag2.tag_id } }),
  ]);

  await Promise.all([
    Tag.destroy({ where: { tag_id: tag1.tag_id } }),
    Tag.destroy({ where: { tag_id: tag2.tag_id } }),
    DataSource.destroy({ where: { publisher: publisher.id } }),
  ]);

  await Publisher.destroy({ where: { id: publisher.id } });
}

beforeAll(async () => {
  await cleanup();

  // Have a publisher to work with

  await Publisher.create(publisher);

  await Promise.all([
    DataSource.create(datasource1),
    DataSource.create(datasource2),
    Tag.create(tag1),
    Tag.create(tag2),
  ]);
});

// Cleanup fake datasources and close the connection

afterAll(async () => {
  await cleanup();

  await disconnect();
});

it("can create, read, update and delete a DataSourceTag", async () => {
  for (let tag of [tag1, tag2]) {
    for (let ds of [datasource1, datasource2]) {
      await DataSourceTag.create({
        datasource_id: ds.datasource_id,
        tag_id: tag.tag_id,
      });
    }
  }

  let match = await DataSourceTag.findOne({
    where: { tag_id: tag1.tag_id, datasource_id: datasource1.datasource_id },
  });

  expect(match.tag_id).toEqual(tag1.tag_id);
  expect(match.datasource_id).toEqual(datasource1.datasource_id);
  expect(match.created).toBeDefined();
  expect(match.last_updated).toBeDefined();

  let matches = await DataSourceTag.findAll({ where: { tag_id: tag1.tag_id } });

  expect(matches.length).toEqual(2);

  matches = await DataSourceTag.findAll({
    where: { datasource_id: datasource1.datasource_id },
  });

  expect(matches.length).toEqual(2);

  await match.destroy();

  matches = await DataSourceTag.findAll({ where: { tag_id: tag1.tag_id } });

  expect(matches.length).toEqual(1);

  matches = await DataSourceTag.findAll({
    where: { datasource_id: datasource1.datasource_id },
  });

  expect(matches.length).toEqual(1);

  await DataSourceTag.destroy({
    where: { datasource_id: datasource1.datasource_id },
  });

  matches = await DataSourceTag.findAll({
    where: { datasource_id: datasource1.datasource_id },
  });

  expect(matches.length).toEqual(0);

  matches = await DataSourceTag.findAll({
    where: { datasource_id: datasource2.datasource_id },
  });

  expect(matches.length).toEqual(2);

  await DataSourceTag.destroy({
    where: { datasource_id: datasource2.datasource_id },
  });

  matches = await DataSourceTag.findAll({
    where: { datasource_id: datasource2.datasource_id },
  });

  expect(matches.length).toEqual(0);
});
