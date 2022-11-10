// actorname.test.ts -- tests for ORM Actor

import {Actor} from './actor'
import {DataSource} from './datasource'
import {Publisher} from './publisher'
import {ActorName} from './actorname'
const disconnect = require('./init').disconnect

const publisherProps = {
    id: "actorname.test.ts:publisher:1",
    name: "Fake publisher from actorname.test.ts",
    URL: "https://fake.example/publisher"
}

const datasourceProps = {
    datasource_id: "actorname.test.ts:datasource:1",
    name: "Fake datasource from actorname.test.ts",
    publisher: publisherProps.id,
    published: new Date(2022, 10, 12),
    URL: "https://fake.example/datasource"
}

const countryProps = {
    actor_id: "actorname.test.ts:actor:country:1",
    type: "country",
    name: "Fake country actor from actorname.test.ts",
    datasource_id: datasourceProps.datasource_id
}

const enPreferredProps = {
    actor_id: countryProps.actor_id,
    name: countryProps.name,
    language: 'en',
    preferred: true,
    datasource_id: datasourceProps.datasource_id
}

const enAlternativeProps = {
    actor_id: countryProps.actor_id,
    name: "Ersatz country actor from actorname.test.ts",
    language: 'en',
    preferred: false,
    datasource_id: datasourceProps.datasource_id
}

const frPreferredProps = {
    actor_id: countryProps.actor_id,
    name: "Faux comédien campagnard de actorname.test.ts",
    language: 'fr',
    preferred: true,
    datasource_id: datasourceProps.datasource_id
}

beforeAll(async () => {

    // Clean up if there were failed tests

    await ActorName.destroy({where: {actor_id: countryProps.actor_id}})
    await Actor.destroy({where: {actor_id: countryProps.actor_id}})
    await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Publisher.destroy({where: {id: publisherProps.id}})

    // Create referenced rows

    await Publisher.create(publisherProps)
    await DataSource.create(datasourceProps)
    await Actor.create(countryProps)
})

afterAll(async () => {

    // Clean up if there were failed tests

    await ActorName.destroy({where: {actor_id: countryProps.actor_id}})
    await Actor.destroy({where: {actor_id: countryProps.actor_id}})
    await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Publisher.destroy({where: {id: publisherProps.id}})

    // Close database connections

    await disconnect()
})

it("can get Actor names", async () => {

    let enpref = await ActorName.create(enPreferredProps)
    expect(enpref.name).toEqual(enPreferredProps.name)

    let frpref = await ActorName.create(frPreferredProps)
    expect(frpref.name).toEqual(frPreferredProps.name)

    let enalt = await ActorName.create(enAlternativeProps)
    expect(enalt.name).toEqual(enAlternativeProps.name)

    let matches = await ActorName.findAll({where: {
        actor_id: countryProps.actor_id,
        language: 'en'
    }})

    expect(matches.length).toEqual(2)

    matches = await ActorName.findAll({where: {
        actor_id: countryProps.actor_id,
        language: 'en',
        preferred: true
    }})

    expect(matches.length).toEqual(1)
    expect(matches[0].name).toEqual(enpref.name)

    matches = await ActorName.findAll({where: {
        actor_id: countryProps.actor_id,
        language: 'fr'
    }})

    expect(matches.length).toEqual(1)

    await enpref.destroy()
    await enalt.destroy()

    matches = await ActorName.findAll({where: {
        actor_id: countryProps.actor_id,
        language: 'en'
    }})

    expect(matches.length).toEqual(0)

    await frpref.destroy()


    matches = await ActorName.findAll({where: {
        actor_id: countryProps.actor_id,
        language: 'fr'
    }})

    expect(matches.length).toEqual(0)
})