// targettag.test.ts -- tests for ORM TargetTag

import {Actor} from './actor'
import {DataSource} from './datasource'
import {Publisher} from './publisher'
import {Target} from './target'
import {Tag} from './tag'
import {TargetTag} from './targettag'

const disconnect = require('./init').disconnect

const publisherProps = {
    id: "targettag.test.ts:publisher:1",
    name: "Fake publisher from targettag.test.ts",
    URL: "https://fake.example/publisher"
}

const datasourceProps = {
    datasource_id: "targettag.test.ts:datasource:1",
    name: "Fake datasource from targettag.test.ts",
    publisher: publisherProps.id,
    published: new Date(2022, 10, 12),
    URL: "https://fake.example/datasource"
}

const countryProps = {
    actor_id: "targettag.test.ts:actor:country:1",
    type: "country",
    name: "Fake country actor from targettag.test.ts",
    datasource_id: datasourceProps.datasource_id
}

const regionProps = {
    actor_id: "targettag.test.ts:actor:region:1",
    type: "adm1",
    name: "Fake region actor from targettag.test.ts",
    is_part_of: countryProps.actor_id,
    datasource_id: datasourceProps.datasource_id
}

// Different targets in different years

const countryTarget1Props = {
    target_id: "targettag.test.ts:target:1",
    actor_id: countryProps.actor_id,
    target_type: "absolute",
    baseline_year: 2015,
    baseline_value: 100000000,
    target_year: 2025,
    target_value: 50000000,
    datasource_id: datasourceProps.datasource_id,
    URL: "https://fake.example/countrytarget1",
    summary: "#1 target by a country to make some changes"
}

// Different actor, different identifiers

const regionTarget1Props = {
    target_id: "targettag.test.ts:target:3",
    actor_id: regionProps.actor_id,
    target_type: "percent",
    baseline_year: 2022,
    baseline_value: 10000000,
    target_year: 2030,
    target_value: 75,
    target_units: "percent",
    datasource_id: datasourceProps.datasource_id,
    URL: "https://fake.example/regiontarget3",
    summary: "#3 target by a region to make some changes"
}

const tag1 = {
    tag_id: "target_tag_test_ts_1",
    tag_name: "A tag from the targettag.test.ts unit test"
}

const tag2 = {
    tag_id: "target_tag_test_ts_2",
    tag_name: "A tag from the targettag.test.ts unit test"
}

async function cleanup() {

   await TargetTag.destroy({where: {tag_id: tag1.tag_id}})
   await TargetTag.destroy({where: {tag_id: tag2.tag_id}})

   await Tag.destroy({where: {tag_id: tag1.tag_id}})
   await Tag.destroy({where: {tag_id: tag2.tag_id}})

   await Target.destroy({where: {datasource_id: datasourceProps.datasource_id}})
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
    await Target.create(countryTarget1Props)
    await Target.create(regionTarget1Props)
    await Tag.create(tag1)
    await Tag.create(tag2)
})

afterAll(async () => {

    // Clean up if there were failed tests

    await cleanup()

    // Close database connections

    await disconnect()
})

it("can create and get target tags", async () => {

    for (let target_id of [countryTarget1Props.target_id, regionTarget1Props.target_id]) {
        for (let tag_id of [tag1.tag_id, tag2.tag_id]) {
            await TargetTag.create({target_id: target_id, tag_id: tag_id})
        }
    }

    // Match on primary key

    let match = await TargetTag.findOne({where:
        {target_id: countryTarget1Props.target_id, tag_id: tag1.tag_id}})

    expect(match.target_id).toEqual(countryTarget1Props.target_id)
    expect(match.tag_id).toEqual(tag1.tag_id)

    // Match on Target

    let matches = await TargetTag.findAll({where: {
        target_id: countryTarget1Props.target_id
    }})

    expect(matches.length).toEqual(2)

    // Match on Tag

    matches = await TargetTag.findAll({where: {
        tag_id: tag2.tag_id
    }})

    expect(matches.length).toEqual(2)

    // Destroy country targets

    await TargetTag.destroy({where: {target_id: countryTarget1Props.target_id}})

    // Match on target again

    matches = await TargetTag.findAll({where: {
        target_id: countryTarget1Props.target_id
    }})

    expect(matches.length).toEqual(0)

    // Match on other target

    matches = await TargetTag.findAll({where: {
        target_id: regionTarget1Props.target_id
    }})

    expect(matches.length).toEqual(2)

    // Destroy region targets

    await TargetTag.destroy({where: {target_id: regionTarget1Props.target_id}})

    // Match on other target

    matches = await TargetTag.findAll({where: {
        target_id: regionTarget1Props.target_id
    }})

    expect(matches.length).toEqual(0)
})