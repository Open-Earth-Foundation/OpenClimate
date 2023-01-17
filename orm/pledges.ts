const {Sequelize, DataTypes, Model} = require('sequelize')

const init = require('./init.ts')
const sequelize = init.connect()
const logger = require('../logger').child({module: __filename})

class Pledges extends Model {}

exports.Pledges = Pledges

Pledges.init(
  {
    pledge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    credential_category: {
      type: DataTypes.TEXT,
    },
    credential_type: {
      type: DataTypes.TEXT,
    },
    credential_schema_id: {
      type: DataTypes.TEXT,
    },
    credential_issuer: {
      type: DataTypes.TEXT,
    },
    credential_issue_date: {
      type: DataTypes.DATE,
    },
    organization_id: {
      type: DataTypes.INTEGER,
    },
    organization_name: {
      type: DataTypes.TEXT,
    },
    organization_category: {
      type: DataTypes.TEXT,
    },
    organization_type: {
      type: DataTypes.TEXT,
    },
    organization_credential_id: {
      type: DataTypes.TEXT,
    },
    pledge_target_year: {
      type: DataTypes.INTEGER,
    },
    pledge_emission_target: {
      type: DataTypes.INTEGER,
    },
    pledge_emission_reduction: {
      type: DataTypes.INTEGER,
    },
    pledge_carbon_intensity_target: {
      type: DataTypes.INTEGER,
    },
    pledge_carbon_intensity_reduction: {
      type: DataTypes.INTEGER,
    },
    pledge_base_year: {
      type: DataTypes.INTEGER,
    },
    pledge_base_level: {
      type: DataTypes.INTEGER,
    },
    pledge_plan_details: {
      type: DataTypes.INTEGER,
    },
    pledge_public_statement: {
      type: DataTypes.INTEGER,
    },
    signature_name: {
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
    modelName: 'Pledges',
    tableName: 'pledges',
    timestamps: false,
  },
)


const createPledge = async function (organization_id, data) {
  try {
    const timestamp = Date.now()

    const pledge = await Pledges.create({
      credential_category: data.credential_category,
      credential_type: data.credential_type,
      credential_schema_id: data.credential_schema_id,
      credential_issuer: data.credential_issuer,
      credential_issue_date: data.credential_issue_date,
      organization_id,
      organization_name: data.organization_name,
      organization_category: data.organization_category,
      organization_type: data.organization_type,
      organization_credential_id: data.organization_credential_id,
      pledge_target_year: data.pledge_target_year,
      pledge_emission_target: data.pledge_emission_target,
      pledge_emission_reduction: data.pledge_emission_reduction,
      pledge_carbon_intensity_target: data.pledge_carbon_intensity_target,
      pledge_carbon_intensity_reduction:  data.pledge_carbon_intensity_reduction,
      pledge_base_year: data.pledge_base_year,
      pledge_base_level: data.pledge_base_level,
      pledge_plan_details: data.pledge_plan_details,
      pledge_public_statement: data.pledge_public_statement,
      signature_name: data.signature_name,
      created_at: timestamp,
      updated_at: timestamp,
    })

    return pledge
  } catch (error) {
    logger.error('Error saving pledge to the database: ', error)
  }
}

const readPledge = async function (pledge_id) {
  try {
    const pledge = await Pledges.findAll({
      where: {
        pledge_id,
      }
    })

    return pledge[0]
  } catch (error) {
    logger.error('Could not find pledge by id in the database: ', error)
  }
}

const readPledgeByOrgId = async function (id) {
  try {
    const pledges = await Pledges.findAll({
      where: {
        organization_id: id
      }
    })

    return pledges
  } catch (error) {
    logger.error('Could not find pledges by id in the database: ', error)
  }
}

const readPledges = async function () {
  try {
    const pledges = await Pledges.findAll({})

    return pledges
  } catch (error) {
    logger.error('Could not find pledges in the database: ', error)
  }
}

const updatePledges = async function (
  pledge_id, organization_id, data
) {
  try {
    const timestamp = Date.now()

    const pledge = await Pledges.update(
      {
        credential_category: data.credential_category,
        credential_type: data.credential_type,
        credential_schema_id: data.credential_schema_id,
        credential_issuer: data.credential_issuer,
        credential_issue_date: data.credential_issue_date,
        organization_id,
        organization_name: data.organization_name,
        organization_category: data.organization_category,
        organization_type: data.organization_type,
        organization_credential_id: data.organization_credential_id,
        pledge_target_year: data.pledge_target_year,
        pledge_emission_target: data.pledge_emission_target,
        pledge_emission_reduction: data.pledge_emission_reduction,
        pledge_carbon_intensity_target: data.pledge_carbon_intensity_target,
        pledge_carbon_intensity_reduction:  data.pledge_carbon_intensity_reduction,
        pledge_base_year: data.pledge_base_year,
        pledge_base_level: data.pledge_base_level,
        pledge_plan_details: data.pledge_plan_details,
        pledge_public_statement: data.pledge_public_statement,
        signature_name: data.signature_name,
        updated_at: timestamp,
      },
      {
        where: {
          pledge_id,
        },
      },
    )

    logger.debug(`Pledge updated successfully.`)
    return pledge
  } catch (error) {
    logger.error('Error updating the Pledge: ', error)
  }
}

export = {
  Pledges,
  createPledge,
  readPledge,
  readPledgeByOrgId,
  readPledges,
  updatePledges
}
