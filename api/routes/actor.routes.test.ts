// actor.routes.test.ts -- tests for ORM Actor

import { Actor } from "../orm/actor";
import { DataSource } from "../orm/datasource";
import { Publisher } from "../orm/publisher";
import { Population } from "../orm/population";
import { Territory } from "../orm/territory";
import { GDP } from "../orm/gdp";
import { EmissionsAgg } from "../orm/emissionsagg";
import { Target } from "../orm/target";
import { Tag } from "../orm/tag";
import { DataSourceTag } from "../orm/datasourcetag";
import { EmissionsAggTag } from "../orm/emissionsaggtag";
import { ActorDataCoverage } from "../orm/actordatacoverage";
import { Initiative } from "../orm/initiative";

import { app } from "../app";
import request from "supertest";

const disconnect = require("../orm/init").disconnect;

const ACTOR_DNE = "actor.routes.test.ts:actor:DNE";

const publisher1Props = {
  id: "actor.routes.test.ts:publisher:1",
  name: "Fake publisher from actor.routes.test.ts",
  URL: "https://fake.example/publisher",
};

const datasource1Props = {
  datasource_id: "actor.routes.test.ts:datasource:1",
  name: "Fake datasource from actor.routes.test.ts",
  publisher: publisher1Props.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const publisher2Props = {
  id: "actor.routes.test.ts:publisher:2",
  name: "Fake publisher from actor.routes.test.ts",
  URL: "https://fake.example/publisher",
};

const datasource2Props = {
  datasource_id: "actor.routes.test.ts:datasource:2",
  name: "Fake datasource from actor.routes.test.ts",
  publisher: publisher2Props.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const country1Props = {
  actor_id: "actor.routes.test.ts:actor:country:1",
  type: "country",
  icon: "https://fake.example/icon1.png",
  name: "Fake country actor from actor.routes.test.ts",
  datasource_id: datasource1Props.datasource_id,
};

const country2Props = {
  actor_id: "actor.routes.test.ts:actor:country:2",
  type: "country",
  name: "Fake country actor from actor.routes.test.ts",
  datasource_id: datasource1Props.datasource_id,
};

const cityProps = {
  actor_id: "actor.routes.test.ts:actor:city:1",
  type: "city",
  name: "Fake city actor from actor.routes.test.ts",
  is_part_of: country1Props.actor_id,
  datasource_id: datasource1Props.datasource_id,
};

const territory1Props = {
  actor_id: country1Props.actor_id,
  area: 9984670,
  lat: 624000,
  lng: -964667,
  name: "Fake territory from actor.routes.test.ts",
  datasource_id: datasource1Props.datasource_id,
};

const territory2Props = {
  actor_id: country2Props.actor_id,
  area: 9834000,
  lat: 449672,
  lng: -1037715,
  name: "Fake territory from actor.routes.test.ts",
  datasource_id: datasource1Props.datasource_id,
};

// Different targets in different years

const initiativeProps = {
  initiative_id: "actor.routes.test.ts:initiative:1",
  name: "Fake initiative from actor.routes.test.ts",
  description: "Fake initiative from actor.routes.test.ts",
  URL: "https://fake.example/initiative",
  datasource_id: datasource1Props.datasource_id,
};

const countryTarget1Props = {
  target_id: "actor.routes.test.ts:target:1",
  actor_id: country1Props.actor_id,
  target_type: "absolute",
  baseline_year: 2015,
  baseline_value: 100000000,
  target_year: 2025,
  target_value: 50000000,
  target_unit: "tonnes",
  datasource_id: datasource1Props.datasource_id,
  initiative_id: initiativeProps.initiative_id,
};

const countryTarget2Props = {
  target_id: "actor.routes.test.ts:target:2",
  actor_id: country1Props.actor_id,
  target_type: "percent",
  baseline_year: 2020,
  baseline_value: 100000000,
  target_year: 2030,
  target_value: 75,
  target_unit: "percent",
  datasource_id: datasource1Props.datasource_id,
};

// Different actor, different identifiers

const country2Target1Props = {
  target_id: "actor.routes.test.ts:target:3",
  actor_id: country2Props.actor_id,
  target_type: "percent",
  baseline_year: 2022,
  baseline_value: 10000000,
  target_year: 2030,
  target_value: 75,
  target_unit: "percent",
  datasource_id: datasource1Props.datasource_id,
};

// For recursive tests

const country3Props = {
  actor_id: "actor.routes.test.ts:actor:country:3",
  type: "country",
  name: "Fake country actor from actor.routes.test.ts",
  datasource_id: datasource1Props.datasource_id,
  is_part_of: "EARTH"
};

const region1Props = {
  actor_id: "actor.routes.test.ts:actor:country:3:region:1",
  is_part_of: country3Props.actor_id,
  type: "adm1",
  name: "Fake region actor from actor.routes.test.ts",
  datasource_id: datasource1Props.datasource_id,
};

const region2Props = {
  actor_id: "actor.routes.test.ts:actor:country:3:region:2",
  is_part_of: region1Props.actor_id,
  type: "adm2",
  name: "Fake region actor from actor.routes.test.ts",
  datasource_id: datasource1Props.datasource_id,
};

const city2Props = {
  actor_id: "actor.routes.test.ts:actor:country:3:city:2",
  type: "city",
  name: "Fake city actor from actor.routes.test.ts",
  is_part_of: region1Props.actor_id,
  datasource_id: datasource1Props.datasource_id,
};

const city3Props = {
  actor_id: "actor.routes.test.ts:actor:country:3:city:3",
  type: "city",
  name: "Fake city actor from actor.routes.test.ts",
  is_part_of: region2Props.actor_id,
  datasource_id: datasource1Props.datasource_id,
};

async function cleanup() {
  // Clean up if there were failed tests
  for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let tag_id = `actor_routes_test_ts_${i}`;
    await Promise.all([
      DataSourceTag.destroy({ where: { tag_id: tag_id } }),
      EmissionsAggTag.destroy({ where: { tag_id: tag_id } }),
    ]);
    await Tag.destroy({ where: { tag_id: tag_id } });
  }

  // ActorDataCoverage

  await Promise.all(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) =>
      ActorDataCoverage.destroy({
        where: {
          actor_id: `actor.routes.test.ts:actor:region:1${val}`,
        },
      })
    )
  );

  await Target.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await Initiative.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await EmissionsAgg.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await EmissionsAgg.destroy({
    where: { datasource_id: datasource2Props.datasource_id },
  });
  await Territory.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await GDP.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await Population.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await Actor.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: datasource2Props.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: datasource1Props.datasource_id },
  });
  await Publisher.destroy({ where: { id: publisher2Props.id } });
  await Publisher.destroy({ where: { id: publisher1Props.id } });
}

beforeAll(async () => {
  // Make sure there's no garbage sitting around

  await cleanup();

  // Create referenced rows

  await Publisher.create(publisher1Props);
  await Publisher.create(publisher2Props);
  await DataSource.create(datasource1Props);
  await DataSource.create(datasource2Props);
  await Actor.create(country1Props);
  await Actor.create(country2Props);
  await Actor.create(cityProps);

  // For recursive tests

  await Actor.create(country3Props);
  await Actor.create(region1Props);
  await Actor.create(region2Props);
  await Actor.create(city2Props);
  await Actor.create(city3Props);

  await Territory.create(territory1Props);
  await Territory.create(territory2Props);

  await Initiative.create(initiativeProps);
  await Target.create(countryTarget2Props);
  await Target.create(countryTarget1Props);

  await Target.create(country2Target1Props);

  let vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  await Promise.all(
    vals.map((val) =>
      Actor.create({
        actor_id: `actor.routes.test.ts:actor:region:1${val}`,
        type: "adm1",
        name: `Fake region actor #${val} from actor.routes.test.ts`,
        is_part_of: country1Props.actor_id,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    vals.map((val) =>
      ActorDataCoverage.create({
        actor_id: `actor.routes.test.ts:actor:region:1${val}`,
        has_data: false,
        has_children: false,
        children_have_data: null,
      })
    )
  );

  await Promise.all(
    vals.map((val) =>
      Actor.create({
        actor_id: `actor.routes.test.ts:actor:region:2${val}`,
        type: "adm1",
        name: `Fake region actor #${val} from actor.routes.test.ts`,
        is_part_of: country2Props.actor_id,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    vals.map((val) =>
      Tag.create({
        tag_id: `actor_routes_test_ts_${val}`,
        tag_name: `Fake tag from actor.routes.test.ts #${val}`,
      })
    )
  );

  // Different tags for the two different data sources

  await Promise.all(
    [0, 1, 2, 3].map((val) =>
      DataSourceTag.create({
        tag_id: `actor_routes_test_ts_${val}`,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    [4, 5].map((val) =>
      DataSourceTag.create({
        tag_id: `actor_routes_test_ts_${val}`,
        datasource_id: datasource2Props.datasource_id,
      })
    )
  );

  const years = Array.from({ length: 20 }, (x, i) => i + 1992);

  await Promise.all(
    years.map((year) =>
      Population.create({
        actor_id: country1Props.actor_id,
        year: year,
        population: 10000000 + (year - 1992) * 200000,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    years.map((year) =>
      Population.create({
        actor_id: country2Props.actor_id,
        year: year,
        population: 10000000 + (year - 1992) * 200000,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    years.map((year) =>
      GDP.create({
        actor_id: country1Props.actor_id,
        year: year,
        gdp: 100000000000 + (year - 1992) * 2000000000,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    years.map((year) =>
      GDP.create({
        actor_id: country2Props.actor_id,
        year: year,
        gdp: 10000000000 + (year - 1992) * 200000000,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    years.map((year) =>
      EmissionsAgg.create({
        emissions_id: `actor.routes.test.js:${datasource1Props.datasource_id}:${country1Props.actor_id}:${year}`,
        actor_id: country1Props.actor_id,
        year: year,
        total_emissions: 50000000 + (year - 1992) * 5000000,
        datasource_id: datasource1Props.datasource_id,
      })
    )
  );

  await Promise.all(
    years.map((year) => {
      EmissionsAgg.create({
        emissions_id: `actor.routes.test.js:${datasource1Props.datasource_id}:${country2Props.actor_id}:${year}`,
        actor_id: country2Props.actor_id,
        year: year,
        total_emissions: 50000000 + (year - 1992) * 5000000,
        datasource_id: datasource1Props.datasource_id,
      });
    })
  );

  await Promise.all(
    years.map((year) => {
      EmissionsAgg.create({
        emissions_id: `actor.routes.test.js:${datasource2Props.datasource_id}:${country1Props.actor_id}:${year}`,
        actor_id: country1Props.actor_id,
        year: year,
        total_emissions: 51000000 + (year - 1992) * 5000000,
        datasource_id: datasource2Props.datasource_id,
      });
    })
  );

  await Promise.all(
    years.map((year) => {
      EmissionsAgg.create({
        emissions_id: `actor.routes.test.js:${datasource2Props.datasource_id}:${country2Props.actor_id}:${year}`,
        actor_id: country2Props.actor_id,
        year: year,
        total_emissions: 51000000 + (year - 1992) * 5000000,
        datasource_id: datasource2Props.datasource_id,
      });
    })
  );

  // Different tags for different emissions reports

  await Promise.all(
    years
      .filter((year) => year % 3 == 0)
      .map((year) =>
        EmissionsAggTag.create({
          emissions_id: `actor.routes.test.js:${datasource1Props.datasource_id}:${country1Props.actor_id}:${year}`,
          tag_id: "actor_routes_test_ts_6",
        })
      )
  );

  await Promise.all(
    years
      .filter((year) => year % 5 == 0)
      .map((year) =>
        EmissionsAggTag.create({
          emissions_id: `actor.routes.test.js:${datasource1Props.datasource_id}:${country2Props.actor_id}:${year}`,
          tag_id: "actor_routes_test_ts_7",
        })
      )
  );

  await Promise.all(
    years
      .filter((year) => year % 7 == 0)
      .map((year) =>
        EmissionsAggTag.create({
          emissions_id: `actor.routes.test.js:${datasource2Props.datasource_id}:${country1Props.actor_id}:${year}`,
          tag_id: "actor_routes_test_ts_8",
        })
      )
  );

  await Promise.all(
    years
      .filter((year) => year % 11 == 0)
      .map((year) =>
        EmissionsAggTag.create({
          emissions_id: `actor.routes.test.js:${datasource2Props.datasource_id}:${country2Props.actor_id}:${year}`,
          tag_id: "actor_routes_test_ts_9",
        })
      )
  );
});

afterAll(async () => {
  // Clean up all the fake data

  await cleanup();

  // Close database connections

  await disconnect();
});

it("can get parts of an actor", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}/parts`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      // 10 regions + 1 city
      expect(res.body.data.length).toEqual(11);
      for (let actor of res.body.data) {
        expect(actor.actor_id).toBeDefined();
        expect(actor.name).toBeDefined();
        expect(actor.type).toBeDefined();
      }
    }));

it("can filter parts of an actor by type", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}/parts?type=adm1`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      // 10 regions + 0 city
      expect(res.body.data.length).toEqual(10);
      for (let actor of res.body.data) {
        expect(actor.actor_id).toBeDefined();
        expect(actor.name).toBeDefined();
        expect(actor.type).toBeDefined();
        expect(actor.type).toEqual("adm1");
      }
    }));

it("gets parts of an actor in name order", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}/parts`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      // 10 regions + 1 city
      expect(res.body.data.length).toEqual(11);
      const sorted = res.body.data.slice();
      sorted.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
      expect(res.body.data).toEqual(sorted);
    }));

it("can get data coverage information for parts of an actor", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}/parts`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      // 10 regions + 1 city
      expect(res.body.data.length).toEqual(11);
      for (let actor of res.body.data) {
        expect(actor.actor_id).toBeDefined();
        expect(actor.has_data).toBeDefined();
        expect(actor.has_children).toBeDefined();
        expect(actor.children_have_data).toBeDefined();
      }
      let r1 = res.body.data.find(
        (a) => a.actor_id === "actor.routes.test.ts:actor:region:11"
      );
      expect(r1.has_children).toBeFalsy();
      // We didn't add data for this one, so all should be null
      let c1 = res.body.data.find((a) => a.actor_id === cityProps.actor_id);
      expect(c1.has_children).toBeNull();
    }));

it("can get actor details", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      const data = res.body.data;

      expect(data.actor_id).toEqual(country1Props.actor_id);
      expect(data.name).toEqual(country1Props.name);
      expect(data.type).toEqual(country1Props.type);
      expect(data.area).toEqual(territory1Props.area);
      expect(data.lat).toBeCloseTo(territory1Props.lat / 10000.0);
      expect(data.lng).toBeCloseTo(territory1Props.lng / 10000.0);

      expect(data.population.length).toEqual(20);
      expect(data.population[0].population).toBeDefined();
      expect(typeof data.population[0].population).toEqual("number");
      expect(data.population[0].year).toBeDefined();

      expect(data.gdp.length).toEqual(20);
      expect(data.targets.length).toEqual(2);

      expect(data.emissions).toBeDefined();
      expect(data.emissions[datasource1Props.datasource_id]).toBeDefined();

      const emissions1 = data.emissions[datasource1Props.datasource_id];

      expect(emissions1.tags).toBeDefined();
      expect(emissions1.tags.length).toEqual(4);
      expect(emissions1.tags[0].tag_id).toBeDefined();
      expect(emissions1.tags[0].tag_name).toBeDefined();
      expect(emissions1.data.length).toEqual(20);

      const ea1992 = emissions1.data.find((ea) => ea.year == 1992);

      expect(ea1992).toBeDefined();
      expect(ea1992.tags).toBeDefined();
      expect(ea1992.tags.length).toEqual(1);
      expect(ea1992.tags[0].tag_id).toBeDefined();
      expect(ea1992.tags[0].tag_name).toBeDefined();

      expect(data.emissions[datasource2Props.datasource_id]).toBeDefined();

      const emissions2 = data.emissions[datasource2Props.datasource_id];

      expect(emissions2).toBeDefined();
      expect(emissions2.tags).toBeDefined();
      expect(emissions2.tags.length).toEqual(2);
      expect(emissions2.tags[0].tag_id).toBeDefined();
      expect(emissions2.tags[0].tag_name).toBeDefined();

      expect(emissions2.data).toBeDefined();
      expect(emissions2.data.length).toEqual(20);

      // 2002 is divisible by 7 and 11

      const ea2002 = emissions2.data.find((ea) => ea.year == 2002);

      expect(ea2002).toBeDefined();
      expect(ea2002.tags).toBeDefined();
      expect(ea2002.tags.length).toEqual(1);
      expect(ea2002.tags[0].tag_id).toBeDefined();
      expect(ea2002.tags[0].tag_name).toBeDefined();
    }));

it("returns total emissions in number format", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.emissions).toBeDefined();
      expect(data.emissions[datasource2Props.datasource_id]).toBeDefined();
      const emissions2 = data.emissions[datasource2Props.datasource_id];
      expect(emissions2.data).toBeDefined();
      expect(emissions2.data.length).toBeGreaterThan(0);
      const ea = emissions2.data[0];
      expect(ea.total_emissions).toBeDefined();
      expect(typeof ea.total_emissions).toEqual("number");
    }));

it("orders emissions by year descending", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.emissions).toBeDefined();
      expect(data.emissions[datasource2Props.datasource_id]).toBeDefined();
      const emissions2 = data.emissions[datasource2Props.datasource_id];
      expect(emissions2.data).toBeDefined();
      expect(emissions2.data.length).toBeGreaterThan(0);
      const sorted = emissions2.data.slice();
      sorted.sort((a, b) => b.year - a.year);
      expect(emissions2.data).toEqual(sorted);
    }));

it("orders Population by year descending", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.population).toBeDefined();
      const sorted = data.population.slice();
      sorted.sort((a, b) => b.year - a.year);
      expect(data.population).toEqual(sorted);
    }));

it("orders GDP by year descending", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.gdp).toBeDefined();
      const sorted = data.gdp.slice();
      sorted.sort((a, b) => b.year - a.year);
      expect(data.gdp).toEqual(sorted);
    }));

it("returns GDP values as a number", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.gdp).toBeDefined();
      expect(data.gdp.length).toBeGreaterThan(0);
      expect(typeof data.gdp[0].gdp).toEqual("number");
    }));

it("returns GDP values as a number", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.gdp).toBeDefined();
      expect(data.gdp.length).toBeGreaterThan(0);
      expect(typeof data.gdp[0].gdp).toEqual("number");
    }));

it("returns 404 for actor details when the actor does not exist", async () =>
  request(app)
    .get(`/api/v1/actor/${ACTOR_DNE}`)
    .expect(404)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeDefined();
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
      expect(typeof res.body.message).toEqual("string");
    }));

it("returns 404 for actor parts when the actor does not exist", async () =>
  request(app)
    .get(`/api/v1/actor/${ACTOR_DNE}/parts`)
    .expect(404)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeDefined();
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
      expect(typeof res.body.message).toEqual("string");
    }));

it("can return target_unit", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.targets).toBeDefined();
      expect(data.targets.length).toBeGreaterThan(0);
      const target = data.targets[0];
      expect(target.target_unit).toBeDefined();
      expect(typeof target.target_unit).toEqual("string");
    }));

it("returns the actor icon", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.icon).toBeDefined();
      expect(data.icon).toEqual(country1Props.icon);
    }));

it("returns null actor icon if not specified", async () =>
  request(app)
    .get(`/api/v1/actor/${country2Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.icon).toBeDefined();
      expect(data.icon).toBeNull();
    }));

it("returns GDP data source", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.gdp).toBeDefined();
      expect(data.gdp.length).toBeGreaterThan(0);
      const gdp = data.gdp[0];
      expect(gdp.datasource).toBeDefined();
      expect(typeof gdp.datasource).toEqual("object");
      const datasource = gdp.datasource;
      expect(datasource.datasource_id).toBeDefined();
      expect(datasource.name).toBeDefined();
      expect(datasource.published).toBeDefined();
      expect(datasource.URL).toBeDefined();
    }));

it("returns population data source", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.population).toBeDefined();
      expect(data.population.length).toBeGreaterThan(0);
      const population = data.population[0];
      expect(population.datasource).toBeDefined();
      expect(typeof population.datasource).toEqual("object");
      const datasource = population.datasource;
      expect(datasource.datasource_id).toBeDefined();
      expect(datasource.name).toBeDefined();
      expect(datasource.published).toBeDefined();
      expect(datasource.URL).toBeDefined();
    }));

it("returns territory data source", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.territory).toBeDefined();
      expect(typeof data.territory).toEqual("object");
      const territory = data.territory;
      expect(territory.datasource).toBeDefined();
      expect(typeof territory.datasource).toEqual("object");
      const datasource = territory.datasource;
      expect(datasource.datasource_id).toBeDefined();
      expect(datasource.name).toBeDefined();
      expect(datasource.published).toBeDefined();
      expect(datasource.URL).toBeDefined();
    }));

it("returns targets in target_year order", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.targets).toBeDefined();
      expect(data.targets.length).toEqual(2);
      const years = data.targets.map((t: any) => t.target_year);
      expect(years).toEqual(years.slice().sort());
    }));

it("returns only immediate children when recursive is not set", async () =>
  request(app)
    .get(`/api/v1/actor/${region1Props.actor_id}/parts?type=city`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.length).toBeDefined();
      expect(data.length).toEqual(1);
    }));

it("returns only immediate children when recursive is set to no", async () =>
  request(app)
    .get(`/api/v1/actor/${region1Props.actor_id}/parts?type=city&recursive=no`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.length).toBeDefined();
      expect(data.length).toEqual(1);
    }));

it("returns deep children when recursive is set to yes", async () =>
  request(app)
    .get(`/api/v1/actor/${region1Props.actor_id}/parts?type=city&recursive=yes`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.length).toBeDefined();
      expect(data.length).toEqual(2);
      let names = data.map((actor) => actor.name);
      expect(names[0] <= names[1]).toBeTruthy();
    }));

it("returns target initiative", async () =>
  request(app)
    .get(`/api/v1/actor/${country1Props.actor_id}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();

      const data = res.body.data;

      expect(data.targets).toBeDefined();
      expect(data.targets.length).toBeGreaterThan(0);

      const target = data.targets[0];

      expect(target.initiative).toBeDefined();
      expect(typeof target.initiative).toEqual("object");

      const initiative = target.initiative;

      expect(initiative.initiative_id).toBeDefined();
      expect(typeof initiative.initiative_id).toEqual("string");
      expect(initiative.initiative_id).toEqual(initiativeProps.initiative_id);

      expect(initiative.name).toBeDefined();
      expect(typeof initiative.name).toEqual("string");
      expect(initiative.name).toEqual(initiativeProps.name);

      expect(initiative.description).toBeDefined();
      expect(typeof initiative.description).toEqual("string");
      expect(initiative.description).toEqual(initiativeProps.description);

      expect(initiative.URL).toBeDefined();
      expect(typeof initiative.URL).toEqual("string");
      expect(initiative.URL).toEqual(initiativeProps.URL);
    }));

it("gets a 404 on path to non-existent actor", async () =>
request(app)
  .get(`/api/v1/actor/${ACTOR_DNE}/path`)
  .expect(404))

it("can get path to the actor", async () =>
  request(app)
    .get(`/api/v1/actor/${city3Props.actor_id}/path`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.data).toBeDefined();
      const data = res.body.data;
      expect(data.length).toBeDefined();
      expect(data.length).toEqual(5);
      for (let actor of data) {
        expect(actor.actor_id).toBeDefined()
        expect(actor.name).toBeDefined()
        expect(actor.type).toBeDefined()
      }
      expect(data[0].actor_id).toEqual(city3Props.actor_id)
      expect(data[1].actor_id).toEqual(region2Props.actor_id)
      expect(data[2].actor_id).toEqual(region1Props.actor_id)
      expect(data[3].actor_id).toEqual(country3Props.actor_id)
      expect(data[4].actor_id).toEqual('EARTH')
    }));