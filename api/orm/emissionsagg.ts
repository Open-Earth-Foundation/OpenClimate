// emissionsagg.ts -- ORM mapping layer for EmissionsAgg table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
} from "sequelize";
import { DataSource } from "./datasource";
import { DataSourceQuality } from "./datasourcequality";
import { Methodology } from "./methodology";
import { Actor } from "./actor";
import { integer } from "@elastic/elasticsearch/lib/api/types";

const init = require("./init.ts");
export const sequelize = init.connect();

export class EmissionsAgg extends Model<
  InferAttributes<EmissionsAgg>,
  InferCreationAttributes<EmissionsAgg>
> {
  declare emissions_id: string; /* Unique identifier for this record */
  declare actor_id: string; /* Responsible party for the emissions */
  declare year: number; /* Year of emissions, YYYY */
  declare total_emissions: number; /* Integer value of tonnes of CO2 equivalent */
  declare methodology_id: string; /* Methodology used */
  declare datasource_id: string; /* Source for the data */
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
  static async forPurposeLatest(scoreType, actorID, allEmissions=null, allDSQ=null): Promise<EmissionsAgg> {
    if (!allEmissions) {
      allEmissions = await EmissionsAgg.findAll({
        where: { actor_id: actorID },
      });
    }
    if (allEmissions.length === 0) {
      return null;
    }
    if (!allDSQ) {
      const unique = (v, i, a) => a.indexOf(v) == i;
      let dataSourceIDs = allEmissions
        .map((ea) => ea.datasource_id)
        .filter(unique);
      allDSQ = await DataSourceQuality.findAll({
        where: { datasource_id: dataSourceIDs, score_type: scoreType },
      });
    }
    if (allDSQ.length === 0) {
      return null;
    }
    let dsq = (ea) =>
      allDSQ.find((dsq) => dsq.datasource_id == ea.datasource_id);
    let score = (ea) => {
      let d = dsq(ea);
      return d ? d.score : 0.0;
    };
    let eligible = allEmissions.filter(ea => score(ea) > 0.0)
    // Get the best emissions for the latest year
    let maxYear = Math.max(...eligible.map((ea) => ea.year));
    let latest = eligible.filter((ea) => ea.year === maxYear);
    let sorted = latest.sort((a, b) =>
      score(a) < score(b) ? 1 : score(a) > score(b) ? -1 : 0
    );
    let best = sorted[0];
    return best;
  }
  static async forPurpose(
    scoreType: string,
    actorID: string,
    year: integer,
    allEmissions=null,
    allDSQs=null
  ): Promise<EmissionsAgg> {
    let emissions = null;
    if (allEmissions) {
      // Make sure to filter down by year and actor, JIC
      emissions = allEmissions.filter(e => e.year === year && e.actor_id == actorID)
    } else {
      emissions = await EmissionsAgg.findAll({
        where: { actor_id: actorID, year: year },
       });
    }
    if (emissions.length === 0) {
      return null;
    }
    const unique = (v, i, a) => a.indexOf(v) == i;
    let dataSourceIDs = emissions
      .map((ea) => ea.datasource_id)
      .filter(unique);

    let dsqs = null;

    if (allDSQs) {
      dsqs = allDSQs.filter(d =>
        dataSourceIDs.findIndex(dsid => dsid === d.datasource_id) !== -1 &&
        d.score_type === scoreType )
    } else {
      dsqs = await DataSourceQuality.findAll({
        where: { datasource_id: dataSourceIDs, score_type: scoreType },
      });
    }
    if (dsqs.length === 0) {
      return null;
    }
    // Get the highest-score value
    let dsq = (ea) =>
      dsqs.find((dsq) => dsq.datasource_id == ea.datasource_id);
    let score = (ea) => {
      let d = dsq(ea);
      return d ? d.score : 0.0;
    };
    let sorted = emissions.sort((a, b) =>
      score(a) < score(b) ? 1 : score(a) > score(b) ? -1 : 0
    );
    let best = sorted[0];
    return best;
  }
}

EmissionsAgg.init(
  {
    emissions_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    actor_id: {
      type: DataTypes.STRING,
      references: {
        model: Actor,
        key: "actor_id",
      },
    },
    year: {
      type: DataTypes.INTEGER,
    },
    total_emissions: {
      type: DataTypes.INTEGER,
      get() {
        const rawValue = this.getDataValue("total_emissions");
        return rawValue;
      },
    },
    methodology_id: {
      type: DataTypes.STRING,
      references: {
        model: Methodology,
        key: "methodology_id",
      },
    },
    datasource_id: {
      type: DataTypes.STRING,
      references: {
        model: DataSource,
        key: "datasource_id",
      },
    },
    created: {
      type: DataTypes.DATE,
    },
    last_updated: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "EmissionsAgg",
    tableName: "EmissionsAgg",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
