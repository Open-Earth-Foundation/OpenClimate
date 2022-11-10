// actoridentifier.test.ts -- tests for ORM Actor

import {Actor} from './actor'
import {DataSource} from './datasource'
import {Publisher} from './publisher'
import {ActorIdentifier} from './actoridentifier'
const disconnect = require('./init').disconnect

const publisherProps = {
    id: "actoridentifier.test.ts:publisher:1",
    name: "Fake publisher from actoridentifier.test.ts",
    URL: "https://fake.example/publisher"
}

const datasourceProps = {
    datasource_id: "actoridentifier.test.ts:datasource:1",
    name: "Fake datasource from actoridentifier.test.ts",
    publisher: publisherProps.id,
    published: new Date(2022, 10, 12),
    URL: "https://fake.example/datasource"
}

const countryProps = {
    actor_id: "actoridentifier.test.ts:actor:country:1",
    type: "country",
    name: "Fake country actor from actoridentifier.test.ts",
    datasource_id: datasourceProps.datasource_id
}

const regionProps = {
    actor_id: "actoridentifier.test.ts:actor:region:1",
    type: "adm1",
    name: "Fake region actor from actoridentifier.test.ts",
    is_part_of: countryProps.actor_id,
    datasource_id: datasourceProps.datasource_id
}

const cityProps = {
    actor_id: "actoridentifier.test.ts:actor:city:1",
    type: "city",
    name: "Fake city actor from actoridentifier.test.ts",
    is_part_of: regionProps.actor_id,
    datasource_id: datasourceProps.datasource_id
}

// Different identifers in different namespaces

const countryNamespace1Props = {
    actor_id: countryProps.actor_id,
    identifier: 'TEST-A',
    namespace: 'TEST-1',
    datasource_id: datasourceProps.datasource_id
}

const countryNamespace2Props = {
    actor_id: countryProps.actor_id,
    identifier: 'TEST-BLACK',
    namespace: 'TEST-2',
    datasource_id: datasourceProps.datasource_id
}

// Different actor, different identifiers

const regionNamespace1Props = {
    actor_id: regionProps.actor_id,
    identifier: 'TEST-B',
    namespace: 'TEST-1',
    datasource_id: datasourceProps.datasource_id
}

const regionNamespace2Props = {
    actor_id: regionProps.actor_id,
    identifier: 'TEST-BLUE',
    namespace: 'TEST-2',
    datasource_id: datasourceProps.datasource_id
}

// Identifier conflict, namespace different

const cityNamespace1Props = {
    actor_id: cityProps.actor_id,
    identifier: 'TEST-BLUE',
    namespace: 'TEST-1',
    datasource_id: datasourceProps.datasource_id
}

const cityNamespace2Props = {
    actor_id: cityProps.actor_id,
    identifier: 'TEST-RED',
    namespace: 'TEST-2',
    datasource_id: datasourceProps.datasource_id
}

beforeAll(async () => {

    // Clean up if there were failed tests

    await ActorIdentifier.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Actor.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Publisher.destroy({where: {id: publisherProps.id}})

    // Create referenced rows

    await Publisher.create(publisherProps)
    await DataSource.create(datasourceProps)
    await Actor.create(countryProps)
    await Actor.create(regionProps)
    await Actor.create(cityProps)
})

afterAll(async () => {

    // Clean up if there were failed tests

    await ActorIdentifier.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Actor.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
    await Publisher.destroy({where: {id: publisherProps.id}})

    // Close database connections

    await disconnect()
})

it("can create and get Actor identifiers", async () => {

    await Promise.all([
        ActorIdentifier.create(countryNamespace1Props),
        ActorIdentifier.create(countryNamespace2Props),
        ActorIdentifier.create(regionNamespace1Props),
        ActorIdentifier.create(regionNamespace2Props),
        ActorIdentifier.create(cityNamespace1Props),
        ActorIdentifier.create(cityNamespace2Props)
    ])

    // Match on namespace and identifier

    let match = await ActorIdentifier.findOne({where: {
        identifier: countryNamespace1Props.identifier,
        namespace: countryNamespace1Props.namespace
    }})

    expect(match.actor_id).toEqual(countryNamespace1Props.actor_id)

    // Match on Actor

    let matches = await ActorIdentifier.findAll({where: {
        actor_id: countryProps.actor_id
    }})

    expect(matches.length).toEqual(2)

    // Destroy all identifiers

    await Promise.all([
        ActorIdentifier.destroy({where: {
            identifier: countryNamespace1Props.identifier,
            namespace: countryNamespace1Props.namespace
        }}),
        ActorIdentifier.destroy({where: {
            identifier: countryNamespace2Props.identifier,
            namespace: countryNamespace2Props.namespace
        }}),
        ActorIdentifier.destroy({where: {
            identifier: regionNamespace1Props.identifier,
            namespace: regionNamespace1Props.namespace
        }}),
        ActorIdentifier.destroy({where: {
            identifier: regionNamespace2Props.identifier,
            namespace: regionNamespace2Props.namespace
        }}),
        ActorIdentifier.destroy({where: {
            identifier: cityNamespace1Props.identifier,
            namespace: cityNamespace1Props.namespace
        }}),
        ActorIdentifier.destroy({where: {
            identifier: cityNamespace2Props.identifier,
            namespace: cityNamespace2Props.namespace
        }})
    ])
})