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
const logger = require("../logger").child({ module: __filename });

class Transfers extends Model<
  InferAttributes<Transfers>,
  InferCreationAttributes<Transfers>
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

exports.Transfers = Transfers;

Transfers.init(
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
    modelName: "Transfers",
    tableName: "transfers",
    timestamps: false,
  }
);

const createTransfer = async function (organization_id, data) {
  try {
    const timestamp = Date.now();

    const site = await Transfers.create({
      organization_id: organization_id,
      data: data,
    });

    return site;
  } catch (error) {
    logger.error("Error saving Transfers to the database: ", error);
  }
};

const readTransfersByOrgId = async function (organization_id) {
  try {
    const transfers = await Transfers.findAll({
      where: {
        organization_id,
      },
    });

    return transfers;
  } catch (error) {
    logger.error("Could not find transfers by id in the database: ", error);
  }
};

const updateTransfers = async function (id, organization_id, data) {
  try {
    const timestamp = Date.now();

    const transfer = await Transfers.update(
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

    logger.debug(`Transfers updated successfully.`);
    return transfer;
  } catch (error) {
    logger.error("Error updating the Transfers: ", error);
  }
};

export = {
  Transfers,
  createTransfer,
  readTransfersByOrgId,
  updateTransfers,
};
