// initiative.test.ts -- tests for ORM Initiative

import {DataSource} from './datasource'
import {Publisher} from './publisher'
import {Initiative} from './initiative'
const disconnect = require('./init').disconnect

const publisherProps = {
    id: "initiative.test.ts:publisher:1",
    name: "Fake publisher from initiative.test.ts",
    URL: "https://fake.example/publisher"
}

const datasourceProps = {
    datasource_id: "initiative.test.ts:datasource:1",
    name: "Fake datasource from initiative.test.ts",
    publisher: publisherProps.id,
    published: new Date(2023, 1, 16),
    URL: "https://fake.example/datasource"
}

const initiativeProps = {
    initiative_id: "initiative.test.ts:initiative:1",
    name: "Fake initiative from initiative.test.ts",
    description: "This initiative is fake",
    URL: "https://fake.example/datasource",
    datasource_id: datasourceProps.datasource_id
}

const UPDATED_NAME = "Updated fake initiative from initiative.test.ts"

async function cleanup() {

   await Initiative.destroy({where: {datasource_id: datasourceProps.datasource_id}})
   await DataSource.destroy({where: {datasource_id: datasourceProps.datasource_id}})
   await Publisher.destroy({where: {id: publisherProps.id}})
}

beforeAll(async () => {

    await cleanup()

    // Create referenced rows

    await Publisher.create(publisherProps)
    await DataSource.create(datasourceProps)
})

afterAll(async () => {

    // Clean up if there were failed tests

    await cleanup()

    // Close database connections

    await disconnect()
})

it("can CRUD initiatives", async () => {

    // Create

    let initiative = await Initiative.create(initiativeProps)
    expect(initiative.name).toEqual(initiativeProps.name)

    // Read

    initiative = await Initiative.findByPk(initiativeProps.initiative_id)
    expect(initiative.name).toEqual(initiativeProps.name)

    // Update

    initiative.name = UPDATED_NAME

    await initiative.save()

    initiative = await Initiative.findByPk(initiative.initiative_id)
    expect(initiative.name).toEqual(UPDATED_NAME)

    // Delete

    await initiative.destroy()

    let matches = await Initiative.findAll({where: {initiative_id: initiativeProps.initiative_id}})
    expect(matches.length).toEqual(0)
})