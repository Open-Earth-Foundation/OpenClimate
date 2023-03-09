// datasourcequality.test.ts - test DataSourceQuality ORM

import { DataSource } from "./datasource";
import { Publisher } from "./publisher";
import { DataSourceQuality } from "./datasourcequality";

const disconnect = require("./init").disconnect;

// Fake datasource props

const publisher = {
  id: "datasourcequality.test.ts:publisher:1",
  name: "Fake publisher from datasourcequality.test.ts",
  URL: "https://fake.example/publisher",
};

const datasource1 = {
  datasource_id: "datasourcequality.test.ts:datasource:1",
  name: "Fake datasource from datasourcequality.test.ts",
  URL: "https://fake.example/datasource",
  publisher: publisher.id,
  published: new Date(2022, 10, 12),
};

const datasource2 = {
  datasource_id: "datasourcequality.test.ts:datasource:2",
  name: "Fake datasource from datasourcequality.test.ts",
  URL: "https://fake.example/datasource",
  publisher: publisher.id,
  published: new Date(2022, 10, 12),
};

const datasourcequality1 = {
    datasource_id: datasource1.datasource_id,
    name: "Fake datasourcequality from datasourcequality.test.ts",
    score: 0.9,
    score_type: 'GHG target completion'
};

const datasourcequality2 = {
    datasource_id: datasource1.datasource_id,
    name: "Fake datasourcequality from datasourcequality.test.ts",
    score: 0.9,
    score_type: 'unknown datasource quality type'
};

const datasourcequality3 = {
    datasource_id: datasource2.datasource_id,
    name: "Fake datasourcequality from datasourcequality.test.ts",
    score: 0.4,
    score_type: 'GHG target completion'
};

async function cleanup() {
  await Promise.all([
    DataSourceQuality.destroy({ where: { datasource_id: datasource1.datasource_id } }),
    DataSourceQuality.destroy({ where: { datasource_id: datasource2.datasource_id } }),,
  ]);

  await Promise.all([
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
  ]);
});

// Cleanup fake datasources and close the connection

afterAll(async () => {
  await cleanup();

  await disconnect();
});

it("can create, read, update and delete a DataSourceTag", async () => {
  const [dsq1, dsq2, dsq3] = await Promise.all([
    DataSourceQuality.create(datasourcequality1),
    DataSourceQuality.create(datasourcequality2),
    DataSourceQuality.create(datasourcequality3)
  ])

  let match = await DataSourceQuality.findOne({
    where: { datasource_id: datasource1.datasource_id, score_type: 'GHG target completion' },
  });

  expect(match.datasource_id).toEqual(datasource1.datasource_id);
  expect(match.score_type).toEqual('GHG target completion' );
  expect(match.score).toBeCloseTo(datasourcequality1.score)
  expect(match.created).toBeDefined();
  expect(match.last_updated).toBeDefined();

  let matches = await DataSourceQuality.findAll({ where: { datasource_id: datasource1.datasource_id } });

  expect(matches.length).toEqual(2);

  matches = await DataSourceQuality.findAll({
    where: { score_type: 'GHG target completion'},
  });

  expect(matches.length).toEqual(2);

  await Promise.all([dsq1.destroy(), dsq2.destroy(), dsq3.destroy()])
});
