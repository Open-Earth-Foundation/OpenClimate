// sitemap.routes.test.ts -- tests for /sitemap-* routes

import { Actor } from "../orm/actor";
import { DataSource } from "../orm/datasource";
import { Publisher } from "../orm/publisher";

import { app } from "../app";
import request from "supertest";

const disconnect = require("../orm/init").disconnect;

const DNE = "sitemap_routes_test_ts_actor_DNE";

const publisherProps = {
  id: "sitemap.routes.test.ts:publisher:1",
  name: "Fake publisher from sitemap.routes.test.ts",
  URL: "https://fake.example/publisher",
};

const datasourceProps = {
  datasource_id: "sitemap.routes.test.ts:datasource:1",
  name: "Fake datasource from sitemap.routes.test.ts",
  publisher: publisherProps.id,
  published: new Date(2023, 3, 17),
  URL: "https://fake.example/datasource",
};

const planetProps = {
  actor_id: "sitemap_routes_test_ts_actor_planet_b",
  type: "planet",
  name: "There is no Planet B! Fake planet from sitemap.routes.test.ts",
  datasource_id: datasourceProps.datasource_id,
};

const country1Props = {
  actor_id: "sitemap_routes_test_ts_actor_country_1",
  type: "country",
  name: "Fake country actor from sitemap.routes.test.ts",
  is_part_of: planetProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const country2Props = {
  actor_id: "sitemap_routes_test_ts_actor_country_2",
  type: "country",
  name: "Fake country actor from sitemap.routes.test.ts",
  is_part_of: planetProps.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region1Props = {
  actor_id: "sitemap_routes_test_ts_actor_region_1",
  type: "adm1",
  name: "Fake region actor 1 from sitemap.routes.test.ts",
  is_part_of: country1Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region2Props = {
  actor_id: "sitemap_routes_test_ts_actor_region_2",
  type: "adm1",
  name: "Fake region actor 2 from sitemap.routes.test.ts",
  is_part_of: country1Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region3Props = {
  actor_id: "sitemap_routes_test_ts_actor_region_3",
  type: "adm2",
  name: "Fake region actor 3 from sitemap.routes.test.ts",
  is_part_of: region2Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region4Props = {
  actor_id: "sitemap_routes_test_ts_actor_region_4",
  type: "adm1",
  name: "Fake region actor 4 from sitemap.routes.test.ts",
  is_part_of: country2Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region5Props = {
  actor_id: "sitemap_routes_test_ts_actor_region_5",
  type: "adm1",
  name: "Fake region actor 5 from sitemap.routes.test.ts",
  is_part_of: country2Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const region6Props = {
  actor_id: "sitemap_routes_test_ts_actor_region_6",
  type: "adm2",
  name: "Fake region actor 6 from sitemap.routes.test.ts",
  is_part_of: region5Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city1Props = {
  actor_id: "sitemap_routes_test_ts_actor_city_1",
  type: "city",
  name: "Fake city actor 1 from sitemap.routes.test.ts",
  is_part_of: region1Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city2Props = {
  actor_id: "sitemap_routes_test_ts_actor_city_2",
  type: "city",
  name: "Fake city actor 2 from sitemap.routes.test.ts",
  is_part_of: region3Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city3Props = {
  actor_id: "sitemap_routes_test_ts_actor_city_3",
  type: "city",
  name: "Fake city actor 3 from sitemap.routes.test.ts",
  is_part_of: region4Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city4Props = {
  actor_id: "sitemap_routes_test_ts_actor_city_4",
  type: "city",
  name: "Fake city actor 4 from sitemap.routes.test.ts",
  is_part_of: region6Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const city5Props = {
  actor_id: "sitemap_routes_test_ts_actor_city_5",
  type: "city",
  name: "Fake city actor 5 from sitemap.routes.test.ts",
  is_part_of: country1Props.actor_id,
  datasource_id: datasourceProps.datasource_id,
};

const company1Props = {
  actor_id: 'TESTRORALUCARDPGDG44',
  type: 'company',
  name: 'Fake company 1 from sitemap.routes.test.ts',
  datasource_id: datasourceProps.datasource_id
}

const company2Props = {
  actor_id: 'FAKEJEDSANDERSSMRL13',
  type: 'company',
  name: 'Fake company 2 from sitemap.routes.test.ts',
  datasource_id: datasourceProps.datasource_id
}

const facility1Props = {
  actor_id: 'US:EPA:0000000',
  is_owned_by: company1Props.actor_id,
  type: 'site',
  name: 'Fake factory 1 from sitemap.routes.test.ts',
  datasource_id: datasourceProps.datasource_id
}

const actors = [
  planetProps,
  country1Props,
  country2Props,
  region1Props,
  region2Props,
  region3Props,
  region4Props,
  region5Props,
  region6Props,
  city1Props,
  city2Props,
  city3Props,
  city4Props,
  city5Props,
  company1Props,
  company2Props,
  facility1Props,
];

async function cleanup() {
  await Actor.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await DataSource.destroy({
    where: { datasource_id: datasourceProps.datasource_id },
  });
  await Publisher.destroy({ where: { id: publisherProps.id } });
}

beforeAll(async () => {
  await cleanup();
  await Publisher.create(publisherProps);
  await DataSource.create(datasourceProps);
  for (const props of actors) {
    await Actor.create(props);
  }
})

afterAll(async () => {
  await cleanup();
  await disconnect();
})

it("can get a sitemap index", async () => {
  return request(app)
    .get(`/sitemap-index.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      expect(res.text.length).toBeGreaterThan(0);
      expect(res.text).toMatch('<sitemapindex')
      expect(res.text).toMatch('<sitemap>')
      expect(res.text).toMatch(`/sitemap-country-${country1Props.actor_id}.xml`)
      expect(res.text).toMatch(`/sitemap-company-00.xml`)
    });
});

it("returns 404 for a non-existent country sitemap", async () => {
  return request(app).get(`/sitemap-country-${DNE}.xml`).expect(404);
});

it("returns 400 for a non-country actor sitemap", async () => {
    return request(app).get(`/sitemap-country-${region1Props.actor_id}.xml`).expect(400);
  });

it("can get a sitemap for a country", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      expect(res.text.length).toBeGreaterThan(0);
      expect(res.text).toMatch('<urlset');
      expect(res.text).toMatch('<url>');
      expect(res.text).toMatch(country1Props.actor_id);
      expect(res.text).toMatch(encodeURIComponent(country1Props.name));
      expect(res.text).toMatch('emissions');
    });
});

it("can get adm1 regions for a country in its sitemap", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      // TODO(evanp): do a real parse of the XML
      expect(res.text).toMatch(region1Props.actor_id);
      expect(res.text).toMatch(region2Props.actor_id);
    });
});

it("can get adm2 regions for a country in its sitemap", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      // TODO(evanp): do a real parse of the XML
      expect(res.text).toMatch(region3Props.actor_id);
    });
});

it("can get cities in an adm1 region in country sitemap", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      // TODO(evanp): do a real parse of the XML
      expect(res.text).toMatch(city1Props.actor_id);
    });
});

it("can get cities in an adm2 region in country sitemap", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      // TODO(evanp): do a real parse of the XML
      expect(res.text).toMatch(city2Props.actor_id);
    });
});

it("can get cities in no region in country sitemap", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      // TODO(evanp): do a real parse of the XML
      expect(res.text).toMatch(city5Props.actor_id);
    });
});

it("country sitemap does not contain regions from other countries", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      // TODO(evanp): do a real parse of the XML
      expect(res.text).not.toMatch(region4Props.actor_id);
      expect(res.text).not.toMatch(region5Props.actor_id);
      expect(res.text).not.toMatch(region6Props.actor_id);
    });
});

it("country sitemap does not contain cities from other countries", async () => {
  return request(app)
    .get(`/sitemap-country-${country1Props.actor_id}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      expect(res.text).not.toMatch(city3Props.actor_id);
      expect(res.text).not.toMatch(city4Props.actor_id);
    });
});

it("gets 404 for company sitemap with letters", async () => {
  return request(app)
    .get(`/sitemap-company-AA.xml`)
    .expect(404)
})

it("gets 404 for company sitemap with too many numbers", async () => {
  return request(app)
    .get(`/sitemap-company-1234.xml`)
    .expect(404)
})

it("can get companies with the right LEI in company sitemap", async () => {
  return request(app)
    .get(`/sitemap-company-${company1Props.actor_id.slice(-2)}.xml`)
    .expect(200)
    .expect("Content-Type", /text\/xml/)
    .expect((res: any) => {
      // TODO(evanp): do a real parse of the XML
      expect(res.text).toMatch(company1Props.actor_id);
      expect(res.text).toMatch(facility1Props.actor_id);
    });
});