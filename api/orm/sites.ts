import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
export const sequelize = init.connect()
const logger = require('../logger').child({module: __filename})

class Sites extends Model <InferAttributes<Sites>, InferCreationAttributes<Sites>> {
  declare id: CreationOptional<number>;
  declare organization_id: number;
  declare data: JSON | null;

  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

Sites.init(
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
    modelName: 'Sites',
    tableName: 'sites',
    timestamps: false,
  },
)


export async function createSite (organization_id, data) {
  try {

    const site = await Sites.create({
      organization_id: organization_id,
      data: data
    })

    return site
  } catch (error) {
    logger.error('Error saving site to the database: ', error)
  }
}

export async function readSite(id) {
  try {
    const site = await Sites.findAll({
      where: {
        id,
      }
    })

    return site[0]
  } catch (error) {
    logger.error('Could not find site by id in the database: ', error)
  }
}

export async function readSitesByOrgId (organization_id) {
  try {
    const sites = await Sites.findAll({
      where: {
        organization_id
      }
    })

    return sites
  } catch (error) {
    logger.error('Could not find sites by id in the database: ', error)
  }
}

export async function readSites () {
  try {
    const sites = await Sites.findAll({})

    return sites
  } catch (error) {
    logger.error('Could not find sites in the database: ', error)
  }
}

export async function updateSites (
  id, organization_id, data
) {
  try {
    const timestamp = Date.now()

    const organization = await Sites.update(
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

    logger.debug(`Site updated successfully.`)
    return organization
  } catch (error) {
    logger.error('Error updating the site: ', error)
  }
}

export async function findAllByCountry (countryName: string) {
  try {
    const allSitesByCountry = await Sites.findAll({

      where: {
        data: {
          facility_country: {
            [Op.eq]: countryName
          }
        }
      }

    });
    logger.debug(`Site updated successfully.`)
    return allSitesByCountry
  } catch (error) {
    logger.error('Error updating the site: ', error)
  }
}

export async function findAllByCountryAndJur (countryName: string, jurisdiction:string) {
  try {
    const allSites = await Sites.findAll({

      where: {
        data: {
          facility_country: {
            [Op.eq]: countryName
          },
          facility_jurisdiction: {
            [Op.eq]: jurisdiction
          }
        }
      }

    });
    logger.debug(`Site updated successfully.`)
    return allSites
  } catch (error) {
    logger.error('Error updating the site: ', error)
  }
}