import { Router } from "express";
import { Actor } from "../orm/actor"
import { Territory } from "../orm/territory";
import { Population } from "../orm/population";
import { GDP } from "../orm/gdp";
import { Target } from "../orm/target";
import { EmissionsAgg } from "../orm/emissionsagg";
import { DataSource } from "../orm/datasource"
import { DataSourceTag } from "../orm/datasourcetag"
import { EmissionsAggTag } from "../orm/emissionsaggtag"
import { Tag } from "../orm/tag"
import {isHTTPError, NotFound} from 'http-errors'

const wrap = fn => (req, res, next) => fn(req, res, next).catch((err) => next(err))

const router =  Router();

// Get actor details

router.get('/api/v1/actor/:actor_id', wrap(async (req:any, res:any) => {

    const actor_id: string = req.params.actor_id;

    const actor = await Actor.findByPk(actor_id)

    if (!actor) {
        throw new NotFound(`No actor found with actor ID ${actor_id}`)
    }

    const [territory, emissions, population, gdp, targets] =
        await Promise.all([
            Territory.findByPk(actor_id),
            EmissionsAgg.findAll({where: {actor_id: actor_id}, order: [["year", "desc"]]}),
            Population.findAll({where: {actor_id: actor_id}, order: [["year", "desc"]]}),
            GDP.findAll({where: {actor_id: actor_id}, order: [["year", "desc"]]}),
            Target.findAll({where: {actor_id: actor_id}})
        ])

    // Get unique datasources

    const unique = (v, i, a) => a.indexOf(v) == i
    const dataSourceIDs = emissions
        .map(ea => ea.datasource_id)
        .concat(population.map(p => p.datasource_id))
        .concat(gdp.map(gdp => gdp.datasource_id))
        .concat((territory) ? [territory.datasource_id] : [])
        .filter(unique)

    const [dataSources, dataSourceTags, emissionsAggTags] =
        await Promise.all([
            DataSource.findAll({where: {datasource_id: dataSourceIDs}}),
            DataSourceTag.findAll({where: {datasource_id: dataSourceIDs}}),
            EmissionsAggTag.findAll({where: {emissions_id: emissions.map(e => e.emissions_id)}})
        ])

    // Extract unique tag_ids

    const tagIDs =
        dataSourceTags.map((dst) => dst.tag_id)
        .filter(unique)
        .concat(emissionsAggTags.map((eat) => eat.tag_id)
                .filter(unique))

    const tags = await Tag.findAll({
        where: {tag_id: tagIDs}
    })

    const emissionMap = {}
    const emissionSources = dataSources.filter(ds => -1 !== emissions.findIndex(ea => ea.datasource_id == ds.datasource_id))

    emissionSources.forEach((ds) => {
        emissionMap[ds.datasource_id] = {
            datasource_id: ds.datasource_id,
            name: ds.name,
            publisher: ds.publisher,
            published: ds.published,
            URL: ds.URL,
            tags: dataSourceTags.filter((dst) => dst.datasource_id == ds.datasource_id)
                    .map((dst) => tags.find((tag) => tag.tag_id == dst.tag_id)),
            data: []
        }
    })

    for (let emission of emissions) {
        emissionMap[emission.datasource_id].data.push({
            emissions_id: emission.emissions_id,
            total_emissions: parseInt(String(emission.total_emissions), 10),
            year: emission.year,
            tags: emissionsAggTags.filter((eat) => eat.emissions_id == emission.emissions_id)
                    .map((eat) => tags.find((tag) => tag.tag_id == eat.tag_id)),
        })
    }

    const datasource = (datasource_id:string) => {
        const ds = dataSources.find(ds => ds.datasource_id == datasource_id)
        return (ds) ? {
            datasource_id: ds.datasource_id,
            name: ds.name,
            published: ds.published,
            URL: ds.URL
        } : null
    }

    res.status(200).json({
        success: true,
        data: {
            actor_id: actor.actor_id,
            name: actor.name,
            type: actor.type,
            icon: actor.icon,
            is_part_of: actor.is_part_of,
            area: (territory) ? parseInt(String(territory.area)) : undefined,
            lat: (territory) ? territory.lat / 10000.0 : undefined,
            lng: (territory) ? territory.lng / 10000.0 : undefined,
            territory: (territory) ? {
                    area: (territory) ? parseInt(String(territory.area)) : undefined,
                    lat: (territory) ? territory.lat / 10000.0 : undefined,
                    lng: (territory) ? territory.lng / 10000.0 : undefined,
                    datasource: datasource(territory.datasource_id)
                } : null,
            emissions: emissionMap,
            population: population.map((pop) => {
                return {
                    population: parseInt(String(pop.population), 10),
                    year: pop.year,
                    datasource_id: pop.datasource_id,
                    datasource: datasource(pop.datasource_id)
                }
            }),
            gdp: gdp.map((g) => {
                return {
                    gdp: parseInt(String(g.gdp), 10),
                    year: g.year,
                    datasource_id: g.datasource_id,
                    datasource: datasource(g.datasource_id)
                }
            }),
            targets: targets.map((t) => {
                return {
                    target_id: t.target_id,
                    target_type: t.target_type,
                    baseline_year: t.baseline_year,
                    baseline_value: t.baseline_value,
                    target_year: t.target_year,
                    target_value: t.target_value,
                    target_unit: t.target_unit,
                    datasource_id: t.datasource_id
                }
            })
        }
    })
}));

// Get all parts of the actor

router.get('/api/v1/actor/:actor_id/parts', wrap(async (req:any, res:any) => {

    const actor_id: string = req.params.actor_id;

    const actor = await Actor.findByPk(actor_id)

    if (!actor) {
        throw new NotFound(`No actor found with actor ID ${actor_id}`)
    }

    let parts: Array<Actor> = null;

    const where = {
        is_part_of: actor_id
    }

    if (req.query.type) {
        where['type'] = req.query.type
    }

    parts = await Actor.findAll({
        where: where,
        order: [["name", "ASC"]]
    })

    res.status(200).json({
        success: true,
        data: parts.map((child) => {
            return {
                actor_id: child.actor_id,
                name: child.name,
                type: child.type
            }
        })
    })
}))

export default router;