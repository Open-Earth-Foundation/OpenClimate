import {Client} from "@elastic/elasticsearch";

let client = null

const ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || 'http://openclimate-elasticsearch-service:9200/'
const ELASTIC_SEARCH_USERNAME = process.env.ELASTIC_SEARCH_USERNAME || 'elastic'
const ELASTIC_SEARCH_PASSWORD = process.env.ELASTIC_SEARCH_PASSWORD ||  "manor claw track near buck bonus"

export function getClient() {
  if (client) {
    return client
  } else {
    client = new Client({
      node: ELASTIC_SEARCH_URL,
      auth: {
        username: ELASTIC_SEARCH_USERNAME,
        password: ELASTIC_SEARCH_PASSWORD
      }
    })
  }
}
