// search.routes.test.ts -- tests for /search/ routes

import { Actor } from "../orm/actor";
import { DataSource } from "../orm/datasource";
import { Publisher } from "../orm/publisher";
import { ActorIdentifier } from "../orm/actoridentifier";
import { ActorName } from "../orm/actorname";

import { app } from "../app";
import request from "supertest";

const disconnect = require("../orm/init").disconnect;

const publisherProps = {
  id: "search.routes.test.ts:publisher:1",
  name: "Fake publisher from search.routes.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "search.routes.test.ts:datasource:1",
  name: "Fake datasource from search.routes.test.ts",
  publisher: publisherProps.id,
  published: new Date(2022, 10, 12),
  URL: "https://fake.example/datasource",
};

const planetProps = {
  actor_id: "search.routes.test.ts:actor:planet:b",
  type: "planet",
  name: "There is no Planet B! Fake planet from search.routes.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

const country1Props = {
  actor_id: "search.routes.test.ts:actor:country:1",
  type: "country",
  name: "Fake country actor from search.routes.test.ts",
  is_part_of: planetProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const country2Props = {
  actor_id: "search.routes.test.ts:actor:country:2",
  type: "country",
  name: "Fake country actor from search.routes.test.ts",
  is_part_of: planetProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const name1_1 = {
  actor_id: country1Props.actor_id,
  name: "Country 1",
  language: "en",
  preferred: true,
  datasource_id: datasourceProps.datasource_id,
};

const name1_2 = {
  actor_id: country1Props.actor_id,
  name: "Pays 1",
  language: "fr",
  preferred: true,
  datasource_id: datasourceProps.datasource_id,
};

const name2_1 = {
  actor_id: country2Props.actor_id,
  name: "Country 2",
  language: "en",
  preferred: true,
  datasource_id: datasourceProps.datasource_id,
};

const name2_2 = {
  actor_id: country2Props.actor_id,
  name: "Pays 2",
  language: "fr",
  preferred: true,
  datasource_id: datasourceProps.datasource_id,
};

// For Path investigations

const country3Props = {
  actor_id: "search.routes.test.ts:actor:country:3",
  type: "country",
  name: "Fake country actor 2 from search.routes.test.ts",
  datasource_id: datasourceProps.datasource_id,
  is_part_of: "EARTH"
};

const region2Props = {
  actor_id: "search.routes.test.ts:actor:region:2",
  type: "adm1",
  name: "Fake region actor 2 from search.routes.test.ts",
  is_part_of: country3Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region3Props = {
  actor_id: "search.routes.test.ts:actor:region:3",
  type: "adm2",
  name: "Fake region actor 3 from search.routes.test.ts",
  is_part_of: region2Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city1Props = {
  actor_id: "search.routes.test.ts:actor:city:1",
  type: "city",
  name: "New Flednax fake city from search.routes.test.ts",
  is_part_of: region3Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region4Props = {
  actor_id: "search.routes.test.ts:actor:region:4",
  type: "adm1",
  name: "Fake region actor 4 from search.routes.test.ts",
  is_part_of: country3Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city2Props = {
  actor_id: "search.routes.test.ts:actor:city:2",
  type: "city",
  name: "Old Flednax fake city from search.routes.test.ts",
  is_part_of: region4Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

async function cleanup() {
  await ActorName.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await ActorIdentifier.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await Actor.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await Publisher.destroy({ where: { id: publisherProps.id } });
  return;
}

beforeAll(async () => {
  await cleanup();

  await Publisher.create(publisherProps);
  await DataSource.create(datasourceProps);

  await Actor.create(planetProps);
  await Actor.create(country1Props);
  await Actor.create(country2Props);
  await Actor.create(country3Props);
  await Actor.create(region2Props);
  await Actor.create(region3Props);
  await Actor.create(city1Props);
  await Actor.create(region4Props);
  await Actor.create(city2Props);

  const defaultName = (props) => { return {
    actor_id: props.actor_id,
    name: props.name,
    language: 'en',
    datasource_id: datasourceProps.datasource_id
  } }

  await Promise.all([
    ActorName.create(name1_1),
    ActorName.create(name1_2),
    ActorName.create(name2_1),
    ActorName.create(name2_2),
    ActorName.create(defaultName(country3Props)),
    ActorName.create(defaultName(region2Props)),
    ActorName.create(defaultName(region3Props)),
    ActorName.create(defaultName(city1Props)),
    ActorName.create(defaultName(region4Props)),
    ActorName.create(defaultName(city2Props))
  ]);

  const MAX = 2;

  for (let i of Array(MAX).keys()) {
    await ActorIdentifier.create({
      actor_id: country1Props.actor_id,
      namespace: `search.routes.test.ts:namespace:${i}`,
      identifier: `identifier:${i}`,
      datasource_id: datasourceProps.datasource_id,
    });
    await ActorIdentifier.create({
      actor_id: country2Props.actor_id,
      namespace: `search.routes.test.ts:namespace:${i}`,
      identifier: `identifier:${i + MAX}`,
      datasource_id: datasourceProps.datasource_id,
    });
  }
});

afterAll(async () => {
  await cleanup();

  await disconnect();
});

it("can get the right actor", async () => {
  const namespace = `search.routes.test.ts:namespace:1`;
  const identifier = `identifier:1`;
  return request(app)
    .get(`/api/v1/search/actor?namespace=${namespace}&identifier=${identifier}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      const results = res.body.data;
      expect(results[0].actor_id).toEqual(country1Props.actor_id);
      expect(results[0].name).toEqual(country1Props.name);
      expect(results[0].actor_id).toEqual(country1Props.actor_id);
      expect(results[0].is_part_of).toEqual(country1Props.is_part_of);
      expect(results[0].datasource_id).toEqual(country1Props.datasource_id);
      expect(results[0].created).toBeDefined();
      expect(results[0].last_updated).toBeDefined();
    });
});

it("can get names in results", async () => {
  const namespace = `search.routes.test.ts:namespace:1`;
  const identifier = `identifier:1`;
  return request(app)
    .get(`/api/v1/search/actor?namespace=${namespace}&identifier=${identifier}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      const results = res.body.data;
      expect(results[0].names).toBeDefined();
      expect(results[0].names.length).toBeGreaterThan(0);
      expect(results[0].names.length).toEqual(2);
      const name = results[0].names[0];
      expect(name.name).toBeDefined();
      expect(name.language).toBeDefined();
      expect(name.preferred).toBeDefined();
      expect(name.datasource_id).toBeDefined();
      expect(name.created).toBeDefined();
      expect(name.last_updated).toBeDefined();
    });
});

it("can get identifiers in results", async () => {
  const namespace = `search.routes.test.ts:namespace:1`;
  const identifier = `identifier:1`;
  return request(app)
    .get(`/api/v1/search/actor?namespace=${namespace}&identifier=${identifier}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);

      const first = res.body.data[0];

      expect(first.identifiers).toBeDefined();
      expect(first.identifiers.length).toBeGreaterThan(0);

      const identifier = first.identifiers[0];

      expect(identifier.identifier).toBeDefined();
      expect(identifier.namespace).toBeDefined();
      expect(identifier.datasource_id).toBeDefined();
      expect(identifier.created).toBeDefined();
      expect(identifier.last_updated).toBeDefined();
    });
});

it("can get an empty result when namespace is not found", async () => {
  const namespace = `search.routes.test.ts:namespace:DNE`;
  const identifier = `identifier:1`;
  return request(app)
    .get(`/api/v1/search/actor?namespace=${namespace}&identifier=${identifier}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toEqual(0);
    });
});

it("can get an empty result when an identifier is not found", async () => {
  const namespace = `search.routes.test.ts:namespace:1`;
  const identifier = `identifier:DNE`;
  return request(app)
    .get(`/api/v1/search/actor?namespace=${namespace}&identifier=${identifier}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toEqual(0);
    });
});

it("can get an error with unexpected parameter", async () => {
  return request(app)
    .get(`/api/v1/search/actor?unexpected=foo`)
    .expect(400)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
    });
});

it("can get an error with namespace and no identifier", async () => {
  const namespace = `search.routes.test.ts:namespace:1`;
  return request(app)
    .get(`/api/v1/search/actor?namespace=${namespace}`)
    .expect(400)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
    });
});

it("can get an error with both name and identifier", async () => {
  const identifier = `identifier:1`;
  const name = name1_1.name;
  return request(app)
    .get(`/api/v1/search/actor?identifer=${identifier}&name=${name}`)
    .expect(400)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
    });
});

it("can get an error with both q and name", async () => {
  const q = `search.routes.test.ts`;
  const name = name1_1.name;
  return request(app)
    .get(`/api/v1/search/actor?name=${name}&q=${q}`)
    .expect(400)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
    });
});

it("can get an error with both q and identifier", async () => {
  const identifier = `identifier:1`;
  const q = `search.routes.test.ts`;
  return request(app)
    .get(`/api/v1/search/actor?identifer=${identifier}&q=${q}`)
    .expect(400)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
    });
});

it("can get an error with all three of name, q and identifier", async () => {
  const identifier = `identifier:1`;
  const q = `search.routes.test.ts`;
  const name = name1_1.name;
  return request(app)
    .get(`/api/v1/search/actor?identifer=${identifier}&q=${q}&name={name}`)
    .expect(400)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
    });
});

it("can get results by name", async () => {
  const name = name1_1.name;
  return request(app)
    .get(`/api/v1/search/actor?name=${name}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      const results = res.body.data;
      expect(results[0].actor_id).toEqual(country1Props.actor_id);
    });
});

it("can get results by name and language", async () => {
  const name = name1_2.name;
  const language = name1_2.language;
  return request(app)
    .get(`/api/v1/search/actor?name=${name}&language=${language}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data.length).toEqual(1);
      const results = res.body.data;
      expect(results[0].actor_id).toEqual(country1Props.actor_id);
    });
});

it("can get an error when q is too short", async () => {
  const q = `a`;
  return request(app)
    .get(`/api/v1/search/actor?q=${q}`)
    .expect(400)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toBeDefined();
    });
});

it("can get results by q", async () => {
  const q = "Country";
  return request(app)
    .get(`/api/v1/search/actor?q=${q}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      const results = res.body.data;
      expect(
        results.filter((a) => a.actor_id == country1Props.actor_id).length
      ).toEqual(1);
    });
});

it("can get results by q for identifiers", async () => {
  const q = `identifier:1`;
  return request(app)
    .get(`/api/v1/search/actor?q=${q}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      const results = res.body.data;
      expect(
        results.filter((a) => a.actor_id == country1Props.actor_id).length
      ).toEqual(1);
    });
});

it("can get data coverage information for search results", async () => {
  const q = `identifier:1`;
  return request(app)
    .get(`/api/v1/search/actor?q=${q}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      for (let actor of res.body.data) {
        expect(actor.has_data).toBeDefined();
        expect(actor.has_children).toBeDefined();
        expect(actor.children_have_data).toBeDefined();
      }
    })
  }
);

it("can get path information for search results", async () => {
  const q = `Flednax`;
  return request(app)
    .get(`/api/v1/search/actor?q=${q}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res: any) => {
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);
      for (let actor of res.body.data) {
        expect(actor.root_path_geo).toBeDefined();
        expect(actor.root_path_geo.length).toBeGreaterThan(0);
        for (let ancestor of actor.root_path_geo) {
          expect(ancestor.actor_id).toBeDefined()
          expect(ancestor.type).toBeDefined()
          expect(ancestor.name).toBeDefined()
          expect(ancestor.actor_id).not.toEqual(actor.actor_id)
        }
      }
    })
  }
);