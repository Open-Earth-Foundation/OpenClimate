import {Client} from "@elastic/elasticsearch";

export const client = new Client({
    node: process.env.ELASTIC_SEARCH_URL,
    auth: {
      username: process.env.ELASTIC_SEARCH_USERNAME,
      password: process.env.ELASTIC_SEARCH_PASSWORD
    }
});

const actors = async () => {
    if(process.env.ELASTIC_SEARCH_ENABLED === "yes"){
        const ActorIDS = await client.search({
          // index: process.env.ELASTIC_SEARCH_INDEX_NAME,
          index: 'actors',
          query: {
            match: {
              actor_name: 'new'
            }
        }

        
    })
    console.log(ActorIDS.hits.hits)
    }
}

actors()
