import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
const sequelize = init.connect()
const logger = require('../logger').child({module: __filename})

class Climactions extends Model <InferAttributes<Climactions>, InferCreationAttributes<Climactions>> {
  declare id: CreationOptional<number>;
  declare organization_id: number;
  declare data: JSON | null;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

Climactions.init(
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
    modelName: 'Climactions',
    tableName: 'climactions',
    timestamps: false,
  },
)


const createClimaction = async function (organization_id, data) {
  try {
    const timestamp = Date.now()

    const site = await Climactions.create({
      organization_id: organization_id,
      data: data
    })

    return site
  } catch (error) {
    logger.error('Error saving climaction to the database: ', error)
  }
}

const readClimaction = async function (id) {
  try {
    const climaction = await Climactions.findAll({
      where: {
        id,
      }
    })

    return climaction[0]
  } catch (error) {
    logger.error('Could not find climaction by id in the database: ', error)
  }
}

const readClimactionsByOrgId = async function (organization_id) {
  try {
    const climactions = await Climactions.findAll({
      where: {
        organization_id
      }
    })

    return climactions
  } catch (error) {
    logger.error('Could not find climactions by id in the database: ', error)
  }
}

const readClimactionsByFacilityName = async function (facility_name, organization_id) {
  try {
    const climactions = await Climactions.findAll({
      where: {
        data: {
          '"facility_name"': {
                  $eq: facility_name
              }
            },
        organization_id
      }
    })

    return climactions
  } catch (error) {
    logger.error('Could not find climactions by id in the database: ', error)
  }
}

const readClimactions = async function () {
  try {
    const climactions = await Climactions.findAll({})

    return climactions
  } catch (error) {
    logger.error('Could not find climactions in the database: ', error)
  }
}

const updateClimaction = async function (
  id, organization_id, data
) {
  try {
    const timestamp = Date.now()

    const organization = await Climactions.update(
      {
        organization_id,
        data
      },
      {
        where: {
          id,
        },
      },
    )

    logger.debug(`Climaction updated successfully.`)
    return organization
  } catch (error) {
    logger.error('Error updating the climaction: ', error)
  }
}

export = {
  Climactions,
  createClimaction,
  readClimaction,
  readClimactionsByOrgId,
  readClimactionsByFacilityName,
  readClimactions,
  updateClimaction
}
