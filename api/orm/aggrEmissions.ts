import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
} from "sequelize";

const init = require("./init.ts");
const sequelize = init.connect();

class AggrEmissions extends Model<
  InferAttributes<AggrEmissions>,
  InferCreationAttributes<AggrEmissions>
> {
  declare id: CreationOptional<number>;
  declare organization_id: number;
  declare data: JSON | null;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

AggrEmissions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.INTEGER,
    },
    data: {
      type: DataTypes.JSONB,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "AggrEmissions",
    tableName: "aggremissions",
    timestamps: false,
  }
);

const createAggrEmissions = async function (organization_id, data) {
  const timestamp = Date.now();

  const site = await AggrEmissions.create({
    organization_id: organization_id,
    data: data,
  });

  return site;
};

const readAggrEmissionsByOrgId = async function (organization_id) {
  const aggrEmissions = await AggrEmissions.findAll({
    where: {
      organization_id,
    },
  });

  return aggrEmissions;
};

const readAggrEmissions = async function () {
  const aggrEmissions = await AggrEmissions.findAll({});

  return aggrEmissions;
};

const updateAggrEmissions = async function (id, organization_id, data) {
  const timestamp = Date.now();

  const organization = await AggrEmissions.update(
    {
      organization_id,
      data,
    },
    {
      where: {
        id,
      },
    }
  );

  return organization;
};

export = {
  AggrEmissions,
  createAggrEmissions,
  readAggrEmissions,
  readAggrEmissionsByOrgId,
  updateAggrEmissions,
};
