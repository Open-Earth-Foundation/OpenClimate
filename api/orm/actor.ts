// actor.ts -- ORM definition for Actor table

import {
  DataTypes,
  QueryTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { DataSource } from "./datasource";

const init = require("./init.ts");
export const sequelize = init.connect();

export class Actor extends Model<
  InferAttributes<Actor>,
  InferCreationAttributes<Actor>
> {
  declare actor_id: string; /* Unique identifier for the Actor; ISO-3166, UN/LOCODE, other */
  declare type: string; /* One of: planet, country, adm1, city, organization, site */
  declare name: string; /* Default; see ActorName for alternates and languages */
  declare icon: string; /* URI of a square, small avatar icon, like a flag or logo */
  declare hq: string;
  declare is_part_of: string; /* Where this actor is physically */
  declare is_owned_by: string; /* Only for sites, which company owns them */
  declare datasource_id: string; /* Where the record came from */
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
  static async path(actor_id: string): Promise<Actor[]> {
    const qry = `
    WITH RECURSIVE actor_path(actor_id, type, name, icon, hq, is_part_of, is_owned_by,
       datasource_id, created, last_updated)
    AS (SELECT actor_id, type, name, icon, hq, is_part_of, is_owned_by, datasource_id,
          created, last_updated
        FROM "Actor"
        WHERE actor_id = :actor_id
        UNION ALL
        SELECT a.actor_id, a.type, a.name, a.icon, a.hq, a.is_part_of, a.is_owned_by,
          a.datasource_id, a.created, a.last_updated
        FROM "Actor" a, actor_path ap
        WHERE a.actor_id = ap.is_part_of)
    SELECT actor_id, type, name, icon, hq, is_part_of, is_owned_by,
      datasource_id, created, last_updated
    FROM actor_path
    `;
    return sequelize.query(qry, {
      type: QueryTypes.SELECT,
      model: Actor,
      replacements: { actor_id: actor_id },
    });
  }
  static async paths(actor_ids: string[]): Promise<Actor[][]> {
    const qry = `
    WITH RECURSIVE actor_path(actor_id, type, name, icon, hq, is_part_of, is_owned_by,
       datasource_id, created, last_updated)
    AS (SELECT actor_id, type, name, icon, hq, is_part_of, is_owned_by, datasource_id,
          created, last_updated
        FROM "Actor"
        WHERE actor_id in (:actor_ids)
        UNION ALL
        SELECT a.actor_id, a.type, a.name, a.icon, a.hq, a.is_part_of, a.is_owned_by,
          a.datasource_id, a.created, a.last_updated
        FROM "Actor" a, actor_path ap
        WHERE a.actor_id = ap.is_part_of)
    SELECT actor_id, type, name, icon, hq, is_part_of, is_owned_by,
      datasource_id, created, last_updated
    FROM actor_path
    `;
    const actors: Actor[] = await sequelize.query(qry, {
      type: QueryTypes.SELECT,
      model: Actor,
      replacements: { actor_ids: actor_ids },
    });

    return actor_ids.map((actor_id) => {
      let actor = actors.find((a) => a.actor_id == actor_id);
      let l: Actor[] = [actor];
      while (actor.is_part_of) {
        actor = actors.find((a) => a.actor_id == actor.is_part_of);
        l.push(actor);
      }
      return l;
    });
  }
}

Actor.init(
  {
    actor_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    icon: { type: DataTypes.STRING },
    hq: { type: DataTypes.STRING },
    is_part_of: {
      type: DataTypes.STRING,
      references: {
        model: Actor,
        key: "actor_id",
      },
    },
    is_owned_by: {
      type: DataTypes.STRING,
      references: {
        model: Actor,
        key: "actor_id",
      },
    },
    datasource_id: {
      type: DataTypes.STRING,
      references: {
        model: DataSource,
        key: "datasource_id",
      },
    },
    created: { type: DataTypes.DATE },
    last_updated: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "Actor",
    tableName: "Actor",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
