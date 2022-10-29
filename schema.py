# schema.py -- OpenClimate schema info for data ingestion

# Note that because of foreign key dependencies we need
# to import in this order. Make sure not to put a table
# with a foreign key before the table it refers to!

tables = {
    "Publisher": ["id"],
    "DataSource": ["datasource_id"],
    "Actor": ["actor_id"],
    "ActorIdentifier": ["identifier", "namespace"],
    "ActorName": ["actor_id", "language", "name"],
    "Sector": ["sector_id"],
    "Methodology": ["methodology_id"],
    "EmissionsAgg": ["emissions_id"],
    "EmissionsByScope": ["emissions_id", "scope"],
    "EmissionsBySector": ["emissions_id", "sector_id"],
    "Population": ["actor_id", "year"],
    "GDP": ["actor_id", "year"],
    "Territory": ["actor_id"],
    "Tag": ["tag_id"],
    "DataSourceTag": ["datasource_id", "tag_id"],
    "EmissionsAggTag": ["emissions_id", "tag_id"],
    "Target": ["target_id"],
    "TargetTag": ["target_id", "tag_id"]
}

tagged_tables = {
    "DataSourceTag": "DataSource",
    "EmissionsAggTag": "EmissionsAgg",
    "TargetTag": "Target"
}