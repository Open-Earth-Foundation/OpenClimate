// index.ts -- indexer for OpenClimate data into ElasticSearch

import {Client} from "@elastic/elasticsearch"
import {Sequelize} from "sequelize"

async function insertAllActorNames(options) {

    const sequelize = new Sequelize(
        options.databaseName,
        options.databaseUser,
        options.databasePassword,
        {
          host: options.databaseHost,
          dialect: "postgres",
          omitNull: true,
        }
    )

    const es = new Client({
        node: options.elasticsearchHost,
        auth: {
            username: options.elasticsearchUser,
            password: options.elasticsearchPassword
        }
    });

    const qry = `SELECT actor_id, name, language, preferred, datasource_id, created, last_updated
                FROM "ActorNames"`

    const [results, metadata] = await sequelize.query(qry);

    // XXX: this starts about 150K promises and runs them. Foolishness!

    await Promise.all(results.map((result) => es.index({
        index: options.elasticsearchIndex,
        body: result
    })))

    await es.indices.refresh({index: options.elasticsearchIndex})

    return Promise.all([
        sequelize.close(),
        es.close()
    ])
}

function main() {
    const options = {
        databaseHost: process.env.OPENCLIMATE_HOST,
        databaseName: process.env.OPENCLIMATE_NAME,
        databaseUser: process.env.OPENCLIMATE_USER,
        databasePassword: process.env.OPENCLIMATE_PASSWORD,
        elasticsearchURL: process.env.ELASTICSEARCH_URL,
        elasticsearchIndex: process.env.ELASTICSEARCH_INDEX,
        elasticsearchUser: process.env.ELASTICSEARCH_USER,
        elasticsearchPassword: process.env.ELASTICSEARCH_PASSWORD
    }
    console.log("Starting.")
    insertAllActorNames(options)
    .then(() => {
        console.log("Completed.")
    })
}

main()