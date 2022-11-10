// population.test.ts -- tests for ORM Population

import {Publisher} from './publisher'
import {DataSource} from './datasource'
import {Actor} from './actor'
import {Population} from './population'
const disconnect = require('./init').disconnect

const publisherProps = {
    id: "population.test.ts:publisher:1",
    name: "Fake publisher from population.test.ts",
    URL: "https://fake.example/publisher"
}

const datasourceProps = {
    datasource_id: "population.test.ts:datasource:1",
    name: "Fake datasource from population.test.ts",
    publisher: publisherProps.id,
    published: new Date(2022, 10, 12),
    URL: "https://fake.example/datasource"
}

const countryProps = {
    actor_id: "population.test.ts:actor:1",
    type: "country",
    name: "Fake country actor from population.test.ts",
    datasource_id: datasourceProps.datasource_id
}

const regionProps = {
    actor_id: "population.test.ts:actor:2",
    type: "adm1",
    name: "Fake region actor from population.test.ts",
    is_part_of: countryProps.actor_id,
    datasource_id: datasourceProps.datasource_id
}

async function cleanup() {
    // Clean up if there were failed tests

    await Population.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Actor.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Publisher.destroy({where: {id: publisherProps.id}})
}

beforeAll(async () => {

    await cleanup()

    // Create referenced rows

    await Publisher.create(publisherProps)
    await DataSource.create(datasourceProps)
    await Actor.create(countryProps)
    await Actor.create(regionProps)
})

afterAll(async () => {

    await cleanup()

    // Close database connections

    await disconnect()
})

it("can create and get Population series", async () => {

    // Create population series for country and region

    const years = Array.from({length: 20}, (x, i) => i + 1992);

    await Promise.all(years.map((year) =>
        Population.create({
            actor_id: countryProps.actor_id,
            year: year,
            population: 10000000 + ((year - 1992) * 200000),
            datasource_id: datasourceProps.datasource_id
        })
    ))

    await Promise.all(years.map((year) =>
        Population.create({
            actor_id: regionProps.actor_id,
            year: year,
            population: 1000000 + ((year - 1992) * 20000),
            datasource_id: datasourceProps.datasource_id
        })
    ))

    // Match on Actor

    let matches = await Population.findAll({where: {
        actor_id: countryProps.actor_id
    }})

    expect(matches.length).toEqual(20)

    await Population.destroy({where: {actor_id: countryProps.actor_id}})

    matches = await Population.findAll({where: {
        actor_id: countryProps.actor_id
    }})

    expect(matches.length).toEqual(0)

    await Population.destroy({where: {actor_id: regionProps.actor_id}})
})