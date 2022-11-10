# OpenClimate Schema 1.0

This is the Schema for the OpenClimate 1.0 database. It's used by [OpenClimate](https://openclimate.network/) to store information about climate-related actors in both the public and private sector, their
actions and targets, and their relationships to one another.

The schema supports importing data sets from existing sources. It also
supports self-reported data in the OpenClimate interface.

# License

- Copyright 2022 Open Earth Foundation <https://openearth.org>
- Copyright 2022 Data Driven Envirolab <https://datadrivenlab.org/>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# Source code

The [data-definition language](https://en.wikipedia.org/wiki/Data_definition_language) SQL source code is available in the `SQL` directory. There is one .sql file per table.

Open Earth Foundation (OEF) uses [PostgreSQL](https://postgresql.org/) for
hosting the database directly. Consequently, these SQL files use a
PostgreSQL-inflected dialect of SQL. They should probably work with
other relational database management systems, but might require some tuning.

The .sql files are functional, but their primary use is for documenting
the database structure.

The scripts are not [idempotent](https://en.wikipedia.org/wiki/Idempotence).
If you run `Actor.sql` a second time without dropping the table or
database, you will probably get an error.

Changes to the tables are made directly to each file; this makes them
useful for creating a new database, but bad for updating or altering
an existing database. OEF uses [db-migrate](https://db-migrate.readthedocs.io/) to manage changes to the OpenClimate database directly.

Note that some tables have dependencies on each other because of
foreign key definitions. The `tables.txt` file lists the tables in
dependency order, so this command should work for setting up a new
database:

```bash
for t in `<tables.txt`; do psql -f SQL/$t.sql; done
```

You may need to provide hostname, username, password, and database
parameters to `psql` to get this work correctly!

# Entity-relationship diagram

The following entity-relationship diagram (ERD) shows how the tables are structured and how they interact from a high level. See [Table details](#table-details) for more information about each table.

![Entity-relationship diagram for OpenClimate](OpenClimateSchema.svg "Entity-relationship diagram for OpenClimate")

# Design principles

The schema follows a few design principles.

- `Singular table names`. "Actor" not "Actors", "Publisher" not "Publishers".
- `Externally-determined IDs`. Identities for rows are not randomly-generated,
incremental, or otherwise opaque. For most tables, it's possible to update
information from a datasource without querying the database directly, just
by using the same ID.
- `Data sources noted`. Most rows in tables include a `datasource_id` that
provides information about the provenance of the data.
- `Timestamped`. Most rows in table include a `created` and `last_updated`
timestamp column. These mark when the data was imported or updated in the
database, which helps with synchronisation and delivery over the Web. Publication date can be found in the `published` column of the related `DataSource` row.
- `Units translated at import time`. Upstream data sets may have varying units
for currency, emissions, land area, population. This database schema expects
those units to be converted at import time, not when extracting or comparing
data rows. This makes it easier to use the same database for multiple uses,
but it does require more work on the part of importers.
- `Generality`. We've erred on the side of generality in the design of the schema. Tables have columns that are relevant for all types of
actors. When we need to include information that's specific for particular
kinds of actors, we use the [Tag](#tag) subsystem to tag rows in tables with
extra information.
- `Multiple sources of truth`. For emissions data, we track multiple records of the same information, to provide comparison of methodologies and reporting style. For example, there are records for emissions in the United States from both PRIMAP and the UNFCCC, with about 0.3% difference. For non-emissions contextual data, like population, area, or GDP, multiple sources of truth aren't an important part of this data set, so we only track the best source we can get. For targets, we try to include one version of a target, even if it's mentioned in different data sources.
- `Compound primary keys`. For many tables, there are compound primary keys; that is, keys with multiple columns that are unique across the table. When the table is referenced as a foreign key in many places, however, we use a single constructed identifier, which makes references simpler.
- `Constructed identifier`. Identifiers are often constructed by the data importer to be unique. A common pattern is to use a colon ':' to separate parts of an identifier that are unique. For example, `datasource_id` values are often composed of the publisher ID and a unique ID for the publication.

# Table details

These categories of table are marked in the ERD with different colours. They're not functionally important; all the tables are part of the same schema and database.

Undocumented tables in the `SQL` subdirectory that aren't listed here are actively used and haven't been fully tested. Don't use them.

Undocumented columns in tables named below that aren't called out aren't actively used and shouldn't be used by you.

The column descriptions below are descriptive; refer to the [ERD](#entity-relationship-diagram) for data types and keys.

## Actors

One of the big advantages of the OpenClimate schema is that actors in the climate change world are treated uniformly, regardless of their size or whether they are public or private.

### Actor

An Actor is an entity that is responsible for CO2 emissions in some way. Actors include countries; sub-national regions like states and provinces; cities; private entities like corporations; and sites owned by public or private actors, like mines, farms, factories, and office buildings.

OpenClimate does not track individual human beings as Actors.

- `actor_id`: a unique identifier for an Actor. We use different vocabularies
for different types of Actor, but they are all distinct and shouldn't conflict. See [ActorIdentifier](#actoridentifier) for mapping other
identifier namespaces onto this domain.
    - For countries, we use the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code. For example, Canada is `CA`.
    - For sub-national regions like states and provinces, we use the [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code, including a
    dash ("-") between the country part and the region part. For example,
    `US-NC` is North Carolina, USA.
    - For cities, we use the [UN/LOCODE](https://en.wikipedia.org/wiki/UN/LOCODE), with a space (" ") between the country part and the LOCODE. For example, `ZM LUN` is Lusaka, Zambia.
    - For private entities, we use [LEI](https://en.wikipedia.org/wiki/Legal_Entity_Identifier). For example, the `actor_id` for Ford Motor
    Company is `20S05OYHG0MQM4VUIC57`.
    - For sites owned by other Actors, we use a namespaced version of the
    most relevant national identifier for that site, typically by an environmental regulator or tax agency. For example, a factory in
    Canada tracked by the Environment and Climate Change Canada (ECCC) has
    actor_id `CA:ECCC:10001`.
    - For planet Earth, `EARTH` is the actor ID. No other planets so far!
- `type`: A string representing the type of actor. This is less necessary than it seems, but it's helpful for managing geographical or organizational hierarchies. The main types in use:
    - `planet`: Only Earth.
    - `country`: nation-state or territory. Typically, anything
    with an ISO 3166-1 code.
    - `adm1`: top-level administrative region within a country. Typically,
    states or provinces.
    - `adm2`: second-level administrative regions. For example, England is
    an `adm1` within Great Britain, and Cornwall is an `adm2` within England.
    - `city`: a city, town, or village. For example, Richmond, Quebec, Canada.
    - `organization`: a private entity, like a corporation.
    - `site`: an emissions site, typically owned by an organization, like an
    office building, data center, mine, farm, power plant or factory.
- `name`: A default name to use for this actor. See the [ActorName](#actorname) table for more elaborate ways to handle multiple names in multiple languages.
- `icon`: Full URL of a small (512px x 512px or less) image representing
the actor. For public actors, this will be a flag. For private actors, this may be a logo. This is often null.
- `is_part_of`: actor_id of the immediate geographical parent of the Actor. For instance, the city of Jujuy (AR JUJ) is part of Jujuy state (AR-Y) which in turn is part of Argentina (AR), which is part of Earth (EARTH). This column only contains the most immediate parent; getting higher-level parents requires repeated queries. For `organization` actors, this is typically the
location of the main office, corporate registration, or other main jurisdiction, although this can be tricky for many large organizations. For `site` actors, this is usually a `city`, but sometimes an `adm1` or `adm2` if the site is outside city limits in rural, wilderness, or unincorporated territory.
- `is_owned_by`: an ownership or management relationship, not necessarily geographical. This is typically used to link a `site` to its owning `organization`. Public actors have null values here.
- `datasource_id`: ID of the [DataSource](#datasource) this actor came from. Typically from geographical or government registries, but sometimes actors are added from emissions or targets datasets that weren't otherwise tracked.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### ActorIdentifier

This is the table we use to track structured identifiers for Actors in different namespaces from our default ones. It helps with harmonizing datasets, especially those that use a structured identity format. For human-readable names, see [ActorName](#actorname).

The rows are unique on (`identifier`, and `namespace`). For example, there is only one entry for identifier '300' in namespace 'ISO-3166-1 numeric', with
actor_id = 'GR' (Greece).

To avoid complicated queries, we include the default `actor_id` namespace
in the ActorIdentifier table, too. So, there is an `ActorIdentifier` row
in `namespace` 'ISO-3166-1 alpha-2' with `identifier` 'GR' and `actor_id` 'GR'. This makes getting all the identifiers for an Actor, or looking up an actor by identifier and namespace, a simpler process, at the expense of slightly more storage and slightly ridiculous rows of data.

- `actor_id`: The identified [Actor](#actor).
- `identifier`: A string identifier. Numeric identifiers are represented as strings. Unique within a namespace, but probably not unique outside of them.
- `namespace`: The namespace of the identifier. Typically this is the name
of a structured vocabulary of identifiers. There's not much governance on the
namespaces, but here are some known values:
    - 'UNLOCODE'
    - 'Wikidata'
    - 'ISO-3166-1 alpha-3'
    - 'World Bank'
    - 'CDP'
    - 'ISO-3166-2'
    - 'ISO-3166-1 numeric'
    - 'ISO-3166-1 alpha-2'
- `datasource_id`: ID of the [DataSource](#datasource) this mapping came from. Sometimes from geographical data sources, sometimes from the first imports from a target or emissions dataset.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### ActorName

A human-readable name for an Actor. Actors can have multiple names in the same language, and multiple names in different languages. Two different
actors can have the same name in the same language, or in different languages.

For example, there are 21 actors with an `ActorName` row with name "Springfield", in the USA, Canada and South Africa. Actor names are sometimes but not always unique within a parent geographical (`is_part_of`) boundary.

See [ActorIdentifier](#actoridentifier) for structured identifiers in a namespace.

- `actor_id`: The [Actor](#actor) with the name.
- `name`: A human-readable name for the Actor. May have accented characters
or characters in other scripts, or right-to-left (RTL) presentation.
- `language`: the language for the name. Usually a 2-letter [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes), unless such a code doesn't exist, in which case we use the 3-letter ISO 639-2 code.
- `preferred`: Is this the preferred name to use for the actor in this language? Preference might include these factors, in no particular order:
    - Readability (Cocos Islands more readable than Territory of Cocos (Keeling) Islands, The)
    - Brevity (Bolivia is briefer than Plurinational State of Bolivia)
    - Frequency of use
    - Official use (example: Mumbai vs Bombay, Alphabet Inc. vs Google, Deere & Company vs. John Deere)
    - Current use
    - Word order
    - Clarity (example: United Kingdom is clearer than UK, North Korea is clearer than DPRK)
- `datasource_id`: ID of the [DataSource](#datasource) this name mapping came from. Sometimes from geographical data sources, sometimes from the first imports from a target or emissions dataset.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

## Public-sector actor

For governments, we keep information about the territory governed as well as simple population and GDP metrics.

### Territory

This represents an area governed by the actor.

- `actor_id`: Actor this territory represents.
- `area`: Area in km^2.
- `lat`: Latitude of centroid or major landmark times 10000; 407494 => latitude 40.7494
- `lng`: Longitude of centroid or major landmark times 10000; -739674 => longitude -73.9674
- `admin_bound`: geoJSON of the territory boundary.
- `datasource_id`: ID of the [DataSource](#datasource) this territory information came from. Note that the area, centroid, and geoJSON may come from different datasources, and this will typically be the most recent one.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### Population

Population history or projections of the territory of the Actor. Each row represents a year of population. The rows are unique by `actor_id` and `year`. We don't keep multiple estimates of population for the same Actor and year.

- `actor_id`: Actor ID of territory.
- `population`: Population in units; 1000 => 1000 people
- `year`: Year of measurement, YYYY
- `datasource_id`: ID of the [DataSource](#datasource) this territory information came from. Note that the area, centroid, and geoJSON may come from different datasources, and this will typically be the most recent one.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### GDP

This table represents the [gross domestic product](https://en.wikipedia.org/wiki/Gross_domestic_product) history of the Actor. There is one row per actor per year, maximum. We don't keep different estimates of GDP for the same actor for one year.

- `actor_id`: Actor ID for the economy in question.
- `gdp`: GDP in US dollars, units. 100000000000 is 100 billion USD.
- `year`: Year of measurement, YYYY
- `datasource_id`: ID of the [DataSource](#datasource) this economic information came from
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

## Emissions

To track carbon dioxide (CO2) emissions and equivalent levels of emissions of other greenhouse gases, this part of the schema uses a few tables. The aggregate table [EmissionsAgg](#emissionsagg) holds annual emissions for an Actor for a year. The aggregates can be broken down by scope 1, 2, and 3 in [EmissionsByScope](#emissionsbyscope) or by sector in [EmissionsBySector](#emissionsbysector), or both.

### EmissionsAgg

Each row in this table represents aggregate emissions of CO2 and other greenhouse gases by an actor during a single year. The rows are unique by actor_id, year, and datasource_id; there may be multiple rows for a single actor for a single year. This lets us compare different models of truth from different data sources.

- `emissions_id`: Unique identifier for this record. Typically constructed as `<datasource_id>:<actor_id>:<year>`, although the identifier is opaque. Note that a single identifier is used because this table is referenced in the breakdown tables.
- `actor_id`: Responsible party for the emissions.
- `year`: Year of emissions, YYYY.
- `total_emissions`: Integer value of tonnes of CO2 equivalent.
- `datasource_id`: ID of the [DataSource](#datasource) this emissions information came from.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### EmissionsAggTag

A [Tag](#tag) on an [EmissionsAgg](#emissionsagg) row is used if there are notable features on the emissions row are different from those on the data source. For example, the methodology for an emissions data source is self-reported, but for this row, it's also validated by an auditor.

Note that this table doesn't have a `datasource_id`. The tag is assumed to derive from the same [DataSource](#datasource) as the EmissionsAgg row it references.

Don't repeat tags for every row from a data source; just tag the data source.

- `emissions_id`: ID of the tagged emissions row.
- `tag_id`: Referenced tag. This must exist in the [Tag](#tag) table.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### EmissionsByScope

This table represents a breakdown of a single emissions row by [scope](https://www.epa.gov/climateleadership/scope-1-and-scope-2-inventory-guidance) where those breakdowns are provided. The sum of the emissions values for the different scopes should be less than or equal to the [EmissionsAgg](#emissionsagg) row's total, but might not due to reporting differences that aren't represented in this schema.

Note that there is no `datasource_id`; the DataSource is assumed to be the same as the parent EmissionsAgg row.

- `emissions_id`: What emissions this is aggregated to
- `scope`: An integer for the scope; one of 1, 2, or 3. Additional scope integers may be added.
- `emissions_value`: metric tonnes of CO2 equivalent.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### EmissionsBySector

A group of emissions by sector rows represents a breakdown of the total emissions by the actor according to the activity that caused the emissions, such as transportation, electricity generation, or agriculture. See [Sector](#sector) for a description of how sectors are represented.

The rows are unique by emissions ID and sector ID.

The sum of the emissions values for the different sectors in a single namespace should be less than or equal to the [EmissionsAgg](#emissionsagg) row's total, but discrepancies might occur due to reporting differences that aren't represented in this schema.

Note that there is no `datasource_id`; the DataSource is assumed to be the same as the parent EmissionsAgg row.

- `emissions_id`: Which emissions aggregate this is a part of.
- `sector_id`: The sector for the emissions.
- `emissions_value`: metric tonnes of CO2 equivalent attributed to this sector.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### Sector

Each row represents a sector of activity that produces CO2 or equivalent greenhouse gases. Different reporting tools and regulatory agencies track sectors of activity slightly differently, so this table allows a `namespace` to control uniqueness of the rows.

- `sector_id`: Unique ID for the sector
- `name`: A human-readable name for the sector
- `namespace`: A namespace or vocabulary for the sector. This may be a standards name or identifier, or an identifier for a regulatory agency that maintains its own sector vocabulary.
- `datasource_id`: ID of the [DataSource](#datasource) this sector information came from.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

## Targets

This cluster of tables represents targets for emissions reductions or similar mitigations for climate change.

### Target

A Target is a goal set by the [Actor](#actor), often as part of a treaty or other agreement with similar Actors, but sometimes a voluntary reduction.

Targets are usually unique for a target type, target year, target unit, and actor, but there may be exceptions.

- `target_id`: Unique identifier for this target. Usually composed of
`<datasource_id>:<actor_id>:<baseline_year>:<target_year>:<target_type>`, but it's opaque and may come from another vocabulary.
- `actor_id`: The Actor responsible for the target.
- `target_type`: The type of target; used in exact-match comparisons by software. An open vocabulary, but the following values are widely used:
    - 'Peak of carbon emissions': A goal to reach a peak carbon emissions,
    after which emissions will begin going down. Peak value is given as the target value.
    - 'Relative emission reduction': A reduction in emissions versus baseline year. Percentage is the typical unit.
    - 'Absolute emission reduction': An absolute reduction in emissions. Despite the name, both tonnes of CO2 equivalent and percentage versus baseline value are used.
    - 'Carbon intensity reduction': reducing the amount of CO2 equivalent
    produced relative to economic output, such as GDP or revenue. Typically measured in percent.
- `target_year`: Year of completion, YYYY. Targets may have year values in the past, for historical targets.
- `target_unit`: Unit for the value. Current units supported are:
    - 'tCO2e': tonnes of CO2 equivalent
    - 'percent': percentage reduction
- `target_value`: Value of the target. This is delimited in units by `target_unit`.
- `baseline_year`: Year of comparison, YYYY. If the baseline year and target year are identical, the target is against "business as usual" or "BAU", that is, what would or could happen if no mitigation effort was attempted.
- `baseline_value` Value of comparison. Units are the same as `target_unit`.
- `URL`: URL of a human-readable document on the target.
- `summary`: a short summary in English of the target.
- `datasource_id`: ID of the [DataSource](#datasource) this sector information came from.
- `created`: When this row was added to the table. Not necessarily publication date; see the DataSource for that metadata.
- `last_updated`: When this row was changed. Often the same as `created`. Not necessarily publication date; see the DataSource for that metadata.

### TargetTag

Targets that have properties that aren't well-represented by the standard table columns can add [Tag](#tag)s to the rows for the target to represent those properties. For example, the nationally-defined commitments (NDCs) of the Paris Agreement are often marked as "conditional" (won't happen without financial aid) or "unconditional" (will happen with or without aid). Since that aspect is specific to the Paris Agreement, we represent the property with a tag.

Note that this table doesn't have a `datasource_id`. The tag is assumed to derive from the same [DataSource](#datasource) as the Target row it references.

TargetTag rows provide a many-to-many relationship between Target rows and Tag rows.

Don't repeat tags for every row from a data source; just tag the data source.

- `target_id`: Which target is being tagged.
- `tag_id`: What the tag is. ID must exist in the [Tag](#tag) table.
- `created`: When this row was added to the table.
- `last_updated`: When this row was changed.

## Metadata

To track data provenance, we use a number of tables related to data sets and publishers.

### DataSource

A DataSource is a single version of a dataset or document used to derive data for this database. Multiple versions of the same publication have different DataSource rows.

To the extent that datasources may come from aggregated or edited secondary sources, we tend to name the secondary source instead of the primary source. This makes tracking down errors and updates easier, to the detriment of giving links and credit to the primary source.

- `datasource_id`: A unique identifier for this data source. A common pattern is `<publisher id>:<series identifier>:<publication date>` or `<publisher id>:<series identifier>:<version number>`, but the identifier is opaque and varies by data importer.
- `name`: Title of the data source, human readable.
- `publisher`: Identifier for the [Publisher](#publisher) of the data source.
- `published`: Date of publication of the upstream document or dataset. This can be long before the data was imported to OpenClimate.
- `URL`: URL of the upstream data source. This is preferably the document that describes or links to the data set, not the artifact itself.
- `created`: When this row was added to the table. Usually greater than or equal to `published`.
- `last_updated`: When this row was changed. Usually greater than or equal to `created`.

### DataSourceTag

A Tag is a property of a data set, such as the methodology used for collecting or calculating the data, or the data license, or other ways of identifying data sets.

This table provides a many-to-many relationship between DataSource and Tag.

- `datasource_id`: ID of the tagged [DataSource](#datasource).
- `tag_id`: What the tag is. Must exist in [Tag](#tag) table.
- `created`: When this row was added to the table.
- `last_updated`: When this row was changed.

### Publisher

A data or document publisher. This table lets us collect [DataSource](#datasource) rows produced by the same organization into a related set.

- `id`: unique identifier of the publisher. Often an acronym, like 'OEF'.
- `name`: Name of the publisher.
- `URL`: URL for more information about the publisher; usually the home page of a Web site.
- `created`: When this row was added to the table.
- `last_updated`: When this row was changed.

### Tag

A [tag](https://en.wikipedia.org/wiki/Tag_(metadata)) for a row,
so we can have some extra data about it that isn't captured in the columns.

Tag rows are joined to rows in other tables by a many-to-many junction table.
See [DataSourceTag](#datasourcetag) or [EmissionsAggTag](#emissionsaggtag) for examples.

See https://en.wikipedia.org/wiki/Tag_(metadata) for how tags
can be used.

- `tag_id`: Unique ID for the tag. IDs should be human-readable,
lowercase ASCII, as short as possible, and avoid spaces or punctuation except
underscores. For example, to tag a geographic data source, use 'geo' as the tag. For machine learning, add 'machine_learning' or 'ml'.
- `tag_name`: A longer, human-readable description of the tag.
- `created`: When this row was added to the table.
- `last_updated`: When this row was changed.

# Comments and questions

Comments, questions and suggestions for this schema are tracked in the [Open-Earth-Foundation/OpenClimate-Schema repo issues](https://github.com/Open-Earth-Foundation/OpenClimate-Schema/issues).