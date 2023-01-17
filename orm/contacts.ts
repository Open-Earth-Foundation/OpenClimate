import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
let sequelize = init.connect()
const logger = require('../logger').child({module: __filename})

class Contact extends Model <InferAttributes<Contact>, InferCreationAttributes<Contact>> {
  declare contact_id: CreationOptional<number>;
  declare label: string;
  declare meta_data: JSON | null;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

Contact.init(
  {
    contact_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      // allowNull: false,
    },
    label: {
      type: DataTypes.TEXT,
    },
    meta_data: {
      type: DataTypes.JSON,
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
    modelName: 'Contact',
    tableName: 'contacts', // Our table names don't follow the sequelize convention and thus must be explicitly declared
    timestamps: false,
  },
)

// const {Connection} = require('./connections.js')

const createContact = async function (
  // contact_id, // Auto-issued
  label,
  meta_data,
) {
  try {
    const contact = await Contact.create({
      label: label,
      meta_data: meta_data
    })

    logger.debug('Contact saved successfully.')
    return contact
  } catch (error) {
    logger.error('Error saving contact to the database: ', error)
  }
}

const readBaseContact = async function (contact_id) {
  try {
    const contact = await Contact.findAll({
      where: {
        contact_id: contact_id,
      },
    })

    return contact[0]
  } catch (error) {
    logger.error('Could not find contact in the database: ', error)
  }
}

const readBaseContacts = async function () {
  try {
    const contacts = await Contact.findAll()

    return contacts
  } catch (error) {
    logger.error('Could not find contacts in the database: ', error)
  }
}

const updateContact = async function (contact_id, label, meta_data) {
  try {
    const timestamp = Date.now()

    await Contact.update(
      {
        contact_id: contact_id,
        label: label,
        meta_data: meta_data
      },
      {
        where: {
          contact_id: contact_id,
        },
      },
    )

    logger.debug('Contact updated successfully.')
  } catch (error) {
    logger.error('Error updating the Contact: ', error)
  }
}

const deleteContact = async function (contact_id) {
  try {
    await Contact.destroy({
      where: {
        contact_id: contact_id,
      },
    })

    logger.debug('Successfully deleted contact')
  } catch (error) {
    logger.error('Error while deleting contact: ', error)
  }
}

export = {
  Contact,
  createContact,
  readBaseContact,
  readBaseContacts,
  updateContact,
  deleteContact,
}
