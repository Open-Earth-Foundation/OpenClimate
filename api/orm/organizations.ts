import {User} from './users'
import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
let sequelize = init.connect()
const logger = require('../logger').child({module: __filename})

class Organization extends Model  <InferAttributes<Organization>, InferCreationAttributes<Organization>> {
  declare organization_id: CreationOptional<number>;
  declare name: string;
  declare category: string;
  declare type: string;
  declare country: string;
  declare jurisdiction: string;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

Organization.init(
  {
    organization_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.TEXT,
    },
    country: {
      type: DataTypes.TEXT,
    },
    jurisdiction: {
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
    sequelize, // Pass the connection instance
    modelName: 'Organization',
    tableName: 'organizations', // Our table names don't follow the sequelize convention and thus must be explicitly declared
    timestamps: false,
  },
)

Organization.hasMany(User, {
  foreignKey: {
    name: 'organization_id'
  }
})

User.belongsTo(Organization, {
  foreignKey: {
    name: 'organization_id'
  }
})

const createOrganization = async function (name, category, type, country, jurisdiction) {
  try {
    const timestamp = Date.now()

    const organization = await Organization.create({
      name,
      category,
      type,
      country,
      jurisdiction,
    })

    return organization
  } catch (error) {
    logger.error('Error saving organization to the database: ', error)
  }
}

const readOrganization = async function (organization_id) {
  try {
    const organization = await Organization.findAll({
      where: {
        organization_id,
      }
    })

    return organization[0]
  } catch (error) {
    logger.error('Could not find organization by id in the database: ', error)
  }
}

const readOrganizationByName = async function (name) {
  try {
    const organization = await Organization.findAll({
      where: {
        name
      }
    })

    return organization[0]
  } catch (error) {
    logger.error('Could not find organization by id in the database: ', error)
  }
}

const readOrganizations = async function () {
  try {
    const organizations = await Organization.findAll({})

    return organizations
  } catch (error) {
    logger.error('Could not find organizations in the database: ', error)
  }
}

const updateOrganization = async function (
  organization_id, name, category, type, country, jurisdiction
) {
  try {
    const timestamp = Date.now()

    const organization = await Organization.update(
      {
        name,
        category,
        type,
        country,
        jurisdiction,
      },
      {
        where: {
          organization_id,
        },
      },
    )

    logger.debug(`Organization updated successfully.`)
    return organization
  } catch (error) {
    logger.error('Error updating the Organization: ', error)
  }
}

// Need a strategy for updating users who had this organization...
// So we're waiting to handle this scenario later
// const deleteOrganization = async function (organization_id) {
//   try {
//     await Organization.destroy({
//       where: {
//         organization_id,
//       },
//     })

//     logger.debug('Organization was successfully deleted')
//     return organization_id
//   } catch (error) {
//     logger.error('Error while deleting organization: ', error)
//   }
// }

export = {
  Organization,
  createOrganization,
  readOrganization,
  readOrganizationByName,
  readOrganizations,
  updateOrganization,
  sequelize,
  // deleteOrganization
}
