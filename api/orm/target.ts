// target.ts -- ORM mapping layer for Target table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
  Sequelize,
} from "sequelize";
import { DataSource } from "./datasource";
import { Actor } from "./actor";
import { Initiative } from "./initiative";
import { EmissionsAgg } from './emissionsagg';

const init = require("./init.ts");
export const sequelize = init.connect();

export class Target extends Model<
  InferAttributes<Target>,
  InferCreationAttributes<Target>
> {
  declare target_id: string;
  declare actor_id: string;
  declare target_type: string;
  declare baseline_year: number;
  declare baseline_value: number;
  declare target_year: number;
  declare target_value: number;
  declare target_unit: string;
  declare bau_value: number;
  declare is_net_zero: boolean;
  declare percent_achieved: number;
  declare URL: string;
  declare summary: string;
  declare datasource_id: string;
  declare initiative_id: string;
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
  public isNetZero() : boolean {
    return this.target_type === 'Net zero'
  };
  public async getPercentComplete(): Promise<any> {
    const scoreType = 'GHG target completion'

    if (this.target_type !== 'Absolute emission reduction' || this.target_unit !== 'percent') {
      return null
    }

    // We use either the declared baseline or the best value for that year

    let baselineValue = this.baseline_value;

    if (!this.baseline_value) {
      const baseline = await EmissionsAgg.forPurpose(scoreType, this.actor_id, this.baseline_year);
      if (!baseline) {
        return null
      }
      baselineValue = Number(baseline.total_emissions)
    }

    let latest = await EmissionsAgg.forPurposeLatest('GHG target completion', this.actor_id)

    if (!latest) {
      return null
    }

    let totalReduction = baselineValue * (this.target_value/100.00)
    let currentReduction = baselineValue - Number(latest.total_emissions)

    return (currentReduction/totalReduction) * 100.0
  }
}

Target.init(
  {
    target_id: {
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
    target_type: {
      type: DataTypes.STRING,
    },
    baseline_year: {
      type: DataTypes.INTEGER,
    },
    target_year: {
      type: DataTypes.INTEGER,
    },
    baseline_value: {
      type: DataTypes.INTEGER,
    },
    target_value: {
      type: DataTypes.INTEGER,
    },
    target_unit: {
      type: DataTypes.STRING,
    },
    bau_value: {
      type: DataTypes.INTEGER,
    },
    is_net_zero: {
      type: DataTypes.BOOLEAN,
    },
    percent_achieved: {
      type: DataTypes.INTEGER,
    },
    URL: {
      type: DataTypes.STRING,
    },
    summary: {
      type: DataTypes.STRING,
    },
    datasource_id: {
      type: DataTypes.STRING,
      references: {
        model: DataSource,
        key: "datasource_id",
      },
    },
    initiative_id: {
      type: DataTypes.STRING,
      references: {
        model: Initiative,
        key: "initiative_id",
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
    modelName: "Target",
    tableName: "Target",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
