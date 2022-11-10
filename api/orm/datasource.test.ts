// datasource.test.ts - test DataSource ORM

import {DataSource} from "./datasource"
import {Publisher} from "./publisher"
const disconnect = require('./init').disconnect

// Fake datasource props

const publisher = {
    id: "datasource.test.ts:publisher:1",
    name: "Fake publisher from datasource.test.ts",
    URL: "https://fake.example/publisher"
}

const props = {
    datasource_id: "datasource.test.ts:datasource:1",
    name: "Fake datasource from datasource.test.ts",
    URL: "https://fake.example/datasource",
    publisher: publisher.id,
    published: new Date(2022, 10, 12)
}

const URL2 = "https://fake.example/datasource2"

beforeAll(async () => {
    // Cleanup any fake datasources

    await DataSource.destroy({where: {datasource_id: props.datasource_id}})
    await Publisher.destroy({where: {id: publisher.id}})

    // Have a publisher to work with

    await Publisher.create(publisher)
})

// Cleanup fake datasources and close the connection

afterAll(async () => {

    await DataSource.destroy({where: {datasource_id: props.datasource_id}})
    await Publisher.destroy({where: {id: publisher.id}})

    await disconnect()
})

it('can create, read, update and delete a DataSource', async () => {

    let createDS = await DataSource.create(props)
    expect(createDS.name).toEqual(props.name)

    let readDS = await DataSource.findByPk(props.datasource_id)
    expect(readDS.URL).toEqual(props.URL)

    expect(readDS.published.getFullYear()).toEqual(2022)
    expect(readDS.published.getMonth()).toEqual(10)
    expect(readDS.published.getDate()).toEqual(12)

    expect(readDS.publisher).toEqual(publisher.id)

    readDS.URL = URL2
    let savedP = await readDS.save()

    let readAgainP = await DataSource.findByPk(props.datasource_id)
    expect(readAgainP.URL).toEqual(URL2)

    await readAgainP.destroy()

    let allMatch = await DataSource.findAll({where: {datasource_id: props.datasource_id}})
    expect(allMatch.length).toEqual(0)
})
