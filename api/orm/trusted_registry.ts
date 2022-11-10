import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
const sequelize = init.connect()


class TrustedRegistry extends Model <InferAttributes<TrustedRegistry>, InferCreationAttributes<TrustedRegistry>> {
  declare id: CreationOptional<number>;
  declare did: string;
  declare organization_name: string;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

TrustedRegistry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    did: {
      type: DataTypes.TEXT,
    },
    organization_name: {
      type: DataTypes.TEXT,
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
    modelName: 'TrustedRegistry',
    tableName: 'trusted_registry', 
    timestamps: false,
  },
)


export async function addTrustedDID (did, organization_name) {
  try {

    const trusted_did = await TrustedRegistry.create({
      did,
      organization_name
    })

    return trusted_did
  } catch (error) {
    console.error('Error saving trusted_did to the database: ', error)
  }
}

export async function readTrustedDID(did) {
  try {
    const trusted_did = await TrustedRegistry.findOne({
      where: {
        did,
      }
    })

    return trusted_did
  } catch (error) {
    console.error('Could not find trusted_did by id in the database: ', error)
  }
}

export async function checkTrustedDID(did) {
  try {
    const trusted_did = await TrustedRegistry.findAll({
      where: {
        did,
      }
    })

    return true
  } catch (error) {
    console.error('Could not find trusted_did by id in the database: ', error)
  }
}

export async function readTrustedDIDByOrgName(organization_name) {
  try {
    const trusted_did = await TrustedRegistry.findAll({
      where: {
        organization_name
      }
    })

    return trusted_did
  } catch (error) {
    console.error('Could not find trusted_dids by org name in the database: ', error)
  }
}

export async function readTrustedDIDs () {
  try {
    const trusted_did = await TrustedRegistry.findAll({})

    return trusted_did
  } catch (error) {
    console.error('Could not find trusted_dids in the database: ', error)
  }
}
