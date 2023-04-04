import { Router } from "express";
import { Actor } from "../orm/actor";
import { BadRequest, NotFound } from "http-errors";
import { Op } from "sequelize";

var xml = require('xml');

var ns = "http://www.sitemaps.org/schemas/sitemap/0.9"

const wrap = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => next(err));

const router = Router();

export default router;

function makeUrl(relative) {
    return (new URL(relative, process.env.WEB_ROOT)).toString()
}

function makeActorUrl(actor) {
  return makeUrl(`/actor/${actor.actor_id}/${actor.name}_emissions`)
}

router.get(
  "/sitemap-index.xml",
  wrap(async (req: any, res: any) => {
    req.logger.debug('sitemap index requested')
    const countries = await Actor.findAll({
        where: {type: 'country'}
    })
    req.logger.debug(`retrieved ${countries.length} countries`)
    const items = Array<any>()
    items.push({_attr: {xmlns: ns}})
    for (let country of countries) {
        items.push({sitemap: [{loc: makeUrl(`/sitemap-country-${country.actor_id}.xml`)}]})
    }
    // Company sitemaps
    for (let i = 0; i < 100; i++) {
      items.push({url: [{loc: makeUrl(`/sitemap-company-${String(i).padStart(2, '0')}.xml`)}]})
    }
    const results = {sitemapindex: items}
    req.logger.debug(`formatted ${items.length} items`)
    res.type('text/xml');
    res.send(xml(results, {declaration: true}))
    res.end()
    req.logger.debug('done')
  })
);

router.get(
    "/sitemap-country-:actorId.xml",
    wrap(async (req: any, res: any) => {
      req.logger.debug('sitemap requested')
      const actorId = req.params.actorId;
      req.logger.debug(`actorId = ${actorId}`)
      const country = await Actor.findByPk(actorId)
      if (!country) {
        throw new NotFound(`No sitemap for id ${actorId}`)
      }
      if (country.type !== 'country') {
        throw new BadRequest(`Actor with id ${actorId} is not a country`)
      }
      const items = Array<any>()
      items.push({_attr: {xmlns: ns}})
      items.push({url: [{loc: makeActorUrl(country)}]})
      const adm1s = await Actor.findAll({where: {is_part_of: country.actor_id, type: 'adm1'}})
      for (let adm1 of adm1s) {
        items.push({url: [{loc: makeActorUrl(adm1)}]})
      }
      const adm2s = await Actor.findAll({
        where: {
            is_part_of: adm1s.map(a => a.actor_id),
            type: 'adm2'
        }
      })
      for (let adm2 of adm2s) {
        items.push({url: [{loc: makeActorUrl(adm2)}]})
      }
      const parents = [country.actor_id].concat(
        adm1s.map(a => a.actor_id),
        adm2s.map(a => a.actor_id)
      )
      const cities = await Actor.findAll({
        where: {
            is_part_of: parents,
            type: 'city'
        }
      })
      for (let city of cities) {
        items.push({url: [{loc: makeActorUrl(city)}]})
      }

      const results = {urlset: items}
      req.logger.debug(`formatted ${items.length} items`)
      res.type('text/xml');
      res.send(xml(results, {declaration: true}))
      res.end()
      req.logger.debug('done')
    }
  ));

  router.get(
    "/sitemap-company-:checksum.xml",
    wrap(async (req: any, res: any) => {
      req.logger.debug('company sitemap requested')
      const checksum = req.params.checksum;
      req.logger.debug(`checksum = ${checksum}`)
      if (checksum.length !== 2) {
        throw new NotFound(`Invalid sitemap ${checksum}`)
      }
      if (!checksum.match(/^\d\d$/)) {
        throw new NotFound(`Invalid sitemap ${checksum}`)
      }
      let items = []
      const companies = await Actor.findAll({
        where: {
          type: 'organization',
          actor_id: {
            [Op.endsWith]: checksum
          }
        }
      })
      for (let company of companies) {
        items.push({url: [{loc: makeActorUrl(company)}]})
      }
      const sites = await Actor.findAll({
        where: {
          type: 'site',
          is_owned_by: {
            [Op.endsWith]: checksum
          }
        }
      })
      for (let site of sites) {
        items.push({url: [{loc: makeActorUrl(site)}]})
      }
      const results = {urlset: items}
      req.logger.debug(`formatted ${items.length} items`)
      res.type('text/xml');
      res.send(xml(results, {declaration: true}))
      res.end()
      req.logger.debug('done')
    }
  ));