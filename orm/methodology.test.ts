// methodology.test.ts -- tests for ORM Methodology

import {Methodology} from './methodology'
const disconnect = require('./init').disconnect

const methodologyProps = {
    methodology_id: "methodology.test.ts:methodology:1",
    name: "Fake methodology from methodology.test.ts",
    methodology_link: "https://fake.example/methodology"
}

beforeAll(async () => {
    await Methodology.destroy({where: {methodology_id: methodologyProps.methodology_id}})
})

it("can create and delete methodologies", async () => {

    await Methodology.create(methodologyProps)

    let meth = await Methodology.findByPk(methodologyProps.methodology_id)

    expect(meth.methodology_id).toEqual(methodologyProps.methodology_id)

    await meth.destroy()

    let matches = await Methodology.findAll({where: {
        methodology_id: methodologyProps.methodology_id
    }})

    expect(matches.length).toEqual(0)
})

afterAll(async () => {
    await Methodology.destroy({where: {methodology_id: methodologyProps.methodology_id}})
    await disconnect()
})