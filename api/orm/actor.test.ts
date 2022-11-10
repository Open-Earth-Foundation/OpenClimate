// actor.test.ts -- tests for ORM Actor

import {Actor} from './actor'
import {DataSource} from './datasource'
import {Publisher} from './publisher'
const disconnect = require('./init').disconnect

const publisherProps = {
    id: "actor.test.ts:publisher:1",
    name: "Fake publisher from actor.test.ts",
    URL: "https://fake.example/publisher"
}

const datasourceProps = {
    datasource_id: "actor.test.ts:datasource:1",
    name: "Fake datasource from actor.test.ts",
    publisher: publisherProps.id,
    published: new Date(2022, 10, 12),
    URL: "https://fake.example/datasource"
}

const countryProps = {
    actor_id: "actor.test.ts:actor:country:1",
    type: "country",
    name: "Fake country actor from actor.test.ts",
    datasource_id: datasourceProps.datasource_id
}

const regionProps = {
    actor_id: "actor.test.ts:actor:region:1",
    type: "adm1",
    name: "Fake region actor from actor.test.ts",
    is_part_of: countryProps.actor_id,
    datasource_id: datasourceProps.datasource_id
}

const UPDATED_NAME = "Updated region name from actor.test.ts"

beforeAll(async () => {

    // Clean up if there were failed tests

    await Actor.destroy({where: {actor_id: regionProps.actor_id}})
    await Actor.destroy({where: {actor_id: countryProps.actor_id}})
    await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Publisher.destroy({where: {id: publisherProps.id}})

    // Create referenced rows

    await Publisher.create(publisherProps)
    await DataSource.create(datasourceProps)
})

afterAll(async () => {

    // Clean up if there were failed tests

    await Actor.destroy({where: {actor_id: regionProps.actor_id}})
    await Actor.destroy({where: {actor_id: countryProps.actor_id}})
    await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Publisher.destroy({where: {id: publisherProps.id}})

    // Close database connections

    await disconnect()
})

it("can CRUD related actors", async () => {

    let country = await Actor.create(countryProps)
    expect(country.name).toEqual(countryProps.name)

    country = await Actor.findByPk(countryProps.actor_id)
    expect(country.name).toEqual(countryProps.name)

    let region = await Actor.create(regionProps)
    expect(region.name).toEqual(regionProps.name)

    region = await Actor.findByPk(regionProps.actor_id)
    expect(region.name).toEqual(regionProps.name)
    expect(region.is_part_of).toEqual(country.actor_id)

    region.name = UPDATED_NAME

    await region.save()

    region = await Actor.findByPk(regionProps.actor_id)
    expect(region.name).toEqual(UPDATED_NAME)

    await region.destroy()

    let matches = await Actor.findAll({where: {actor_id: regionProps.actor_id}})
    expect(matches.length).toEqual(0)

    await country.destroy()

    matches = await Actor.findAll({where: {actor_id: countryProps.actor_id}})
    expect(matches.length).toEqual(0)
})