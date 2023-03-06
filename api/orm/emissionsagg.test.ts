// emissionsagg.test.ts -- tests for ORM Actor

import { Actor } from "./actor";
import { DataSource } from "./datasource";
import { Publisher } from "./publisher";
import { Methodology } from "./methodology";
import { EmissionsAgg } from "./emissionsagg";
const disconnect = require("./init").disconnect;

const geoPublisherProps = {
  id: "emissionsagg.test.ts:publisher:1",
  name: "Fake geo publisher from emissionsagg.test.ts",
  URL: "https://fake.example/publisher",
};

const geoDataSourceProps = {
  datasource_id: "emissionsagg.test.ts:datasource:1",
  name: "Fake geo datasource from emissionsagg.test.ts",
  publisher: geoPublisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const countryProps = {
  actor_id: "emissionsagg.test.ts:actor:country:1",
  type: "country",
  name: "Fake country actor from emissionsagg.test.ts",
  datasource_id: geoDataSourceProps.datasource_id,
};

const regionProps = {
  actor_id: "emissionsagg.test.ts:actor:region:1",
  type: "adm1",
  name: "Fake region actor from emissionsagg.test.ts",
  is_part_of: countryProps.actor_id,
  datasource_id: geoDataSourceProps.datasource_id,
};

const emissionsPublisher1Props = {
  id: "emissionsagg.test.ts:publisher:emissions:1",
  name: "Fake emissions publisher from emissionsagg.test.ts",
  URL: "https://emissions1.example/publisher",
};

const emissionsDataSource1Props = {
  datasource_id: "emissionsagg.test.ts:datasource:emissions:1",
  name: "Fake emissions datasource from emissionsagg.test.ts",
  publisher: emissionsPublisher1Props.id,
  published: new Date(2022, 10, 12),
  URL: "https://emissions1.example/datasource",
};

const methodologyProps = {
  methodology_id: "emissionsagg.test.ts:methodology:1",
  name: "Fake methodology from emissionsagg.test.ts",
  methodology_link: "https://fake.example/methodology",
};

const emissionsPublisher2Props = {
  id: "emissionsagg.test.ts:publisher:emissions:2",
  name: "Fake emissions publisher from emissionsagg.test.ts",
  URL: "https://emissions2.example/publisher",
};

const emissionsDataSource2Props = {
  datasource_id: "emissionsagg.test.ts:datasource:emissions:2",
  name: "Fake emissions datasource from emissionsagg.test.ts",
  publisher: emissionsPublisher2Props.id,
  published: new Date(2022, 10, 12),
  URL: "https://emissions2.example/datasource",
};

// Different emissions for same actor, datasource, different year

const countryDataSource1Year1Props = {
  emissions_id: "emissionsagg.test.ts:emissions:1",
  actor_id: countryProps.actor_id,
  year: 2019,
  total_emissions: 100000,
  datasource_id: emissionsDataSource1Props.datasource_id,
  methodology_id: methodologyProps.methodology_id,
};

const countryDataSource1Year2Props = {
  emissions_id: "emissionsagg.test.ts:emissions:2",
  actor_id: countryProps.actor_id,
  year: 2020,
  total_emissions: 110000,
  datasource_id: emissionsDataSource1Props.datasource_id,
  methodology_id: methodologyProps.methodology_id,
};

// Different actor, same year and datasource

const regionDataSource1Year1Props = {
  emissions_id: "emissionsagg.test.ts:emissions:3",
  actor_id: regionProps.actor_id,
  year: 2019,
  total_emissions: 10000,
  datasource_id: emissionsDataSource1Props.datasource_id,
  methodology_id: methodologyProps.methodology_id,
};

// Same actor, year, different datasource

const regionDataSource2Year1Props = {
  emissions_id: "emissionsagg.test.ts:emissions:4",
  actor_id: regionProps.actor_id,
  year: 2019,
  total_emissions: 11000,
  datasource_id: emissionsDataSource2Props.datasource_id,
  methodology_id: methodologyProps.methodology_id,
};

async function cleanup() {
  await EmissionsAgg.destroy({
    where: { datasource_id: emissionsDataSource1Props.datasource_id },
  });
  await EmissionsAgg.destroy({
    where: { datasource_id: emissionsDataSource2Props.datasource_id },
  });

  await Actor.destroy({
    where: { datasource_id: geoDataSourceProps.datasource_id },
  });

  await DataSource.destroy({
    where: { datasource_id: geoDataSourceProps.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: emissionsDataSource1Props.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: emissionsDataSource2Props.datasource_id },
  });

  await Publisher.destroy({ where: { id: geoPublisherProps.id } });
  await Publisher.destroy({ where: { id: emissionsPublisher1Props.id } });
  await Publisher.destroy({ where: { id: emissionsPublisher2Props.id } });

  await Methodology.destroy({
    where: { methodology_id: methodologyProps.methodology_id },
  });
}

beforeAll(async () => {
  // Clean up if there were failed tests

  await cleanup();

  // Create referenced rows

  await Methodology.create(methodologyProps);

  await Publisher.create(geoPublisherProps);
  await Publisher.create(emissionsPublisher1Props);
  await Publisher.create(emissionsPublisher2Props);

  await DataSource.create(geoDataSourceProps);
  await DataSource.create(emissionsDataSource1Props);
  await DataSource.create(emissionsDataSource2Props);

  await Actor.create(countryProps);
  await Actor.create(regionProps);
});

afterAll(async () => {
  // Clean up if there were failed tests

  await cleanup();

  // Close database connections

  await disconnect();
});

it("can create and get EmissionsAgg", async () => {
  await Promise.all([
    EmissionsAgg.create(countryDataSource1Year1Props),
    EmissionsAgg.create(countryDataSource1Year2Props),
    EmissionsAgg.create(regionDataSource1Year1Props),
    EmissionsAgg.create(regionDataSource2Year1Props),
  ]);

  // Match on actor_id

  let match = await EmissionsAgg.findOne({
    where: {
      actor_id: countryDataSource1Year1Props.actor_id,
      year: countryDataSource1Year1Props.year,
      datasource_id: countryDataSource1Year1Props.datasource_id,
    },
  });

  // XXX: BIGINT becomes string :(

  expect(match.total_emissions).toEqual(
    String(countryDataSource1Year1Props.total_emissions)
  );

  // Match on actor_id

  let matches = await EmissionsAgg.findAll({
    where: {
      actor_id: regionProps.actor_id,
    },
  });

  expect(matches.length).toEqual(2);

  // Destroy all identifiers

  await Promise.all([
    EmissionsAgg.destroy({
      where: {
        emissions_id: countryDataSource1Year1Props.emissions_id,
      },
    }),
    EmissionsAgg.destroy({
      where: {
        emissions_id: countryDataSource1Year2Props.emissions_id,
      },
    }),
    EmissionsAgg.destroy({
      where: {
        emissions_id: regionDataSource1Year1Props.emissions_id,
      },
    }),
    EmissionsAgg.destroy({
      where: {
        emissions_id: regionDataSource2Year1Props.emissions_id,
      },
    }),
  ]);
});
