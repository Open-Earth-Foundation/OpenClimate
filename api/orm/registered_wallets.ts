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

class RegisteredWallets extends Model<
  InferAttributes<RegisteredWallets>,
  InferCreationAttributes<RegisteredWallets>
> {
  declare id: CreationOptional<number>;
  declare did: string;
  declare user_id: number;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

RegisteredWallets.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    did: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
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
    modelName: "RegisteredWallets",
    tableName: "registered_wallets",
    timestamps: false,
  }
);

export async function addWallet(did, user_id) {
  try {
    const wallet = await RegisteredWallets.create({
      did,
      user_id,
    });

    return wallet;
  } catch (error) {
    logger.error("Error saving trusted_did to the database: ", error);
  }
}

export async function readWalletByDid(did) {
  try {
    const wallet = await RegisteredWallets.findOne({
      where: {
        did,
      },
    });

    return wallet;
  } catch (error) {
    logger.error("Could not find trusted_did by id in the database: ", error);
  }
}

export async function readWalletByUserId(user_id) {
  try {
    const wallets = await RegisteredWallets.findAll({
      where: {
        user_id,
      },
    });

    return wallets;
  } catch (error) {
    logger.error(
      "Could not find trusted_dids by org name in the database: ",
      error
    );
  }
}

export async function readWallets() {
  try {
    const wallets = await RegisteredWallets.findAll({});

    return wallets;
  } catch (error) {
    logger.error("Could not find trusted_dids in the database: ", error);
  }
}
