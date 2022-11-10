import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';
const { Sequelize, Transaction } = require('sequelize');

const init = require('./init.ts')
let sequelize = init.connect()
const {Contact} = require('./contacts.ts')

class Demographic extends Model <InferAttributes<Demographic>, InferCreationAttributes<Demographic>>{
  declare contact_id: CreationOptional<number>;
  declare email: string;
  declare phone: string;
  declare address: JSON | null;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

Demographic.init(
  {
    contact_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      // allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.TEXT,
    },
    address: {
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
    modelName: 'Demographic',
    tableName: 'demographic_data', // Our table names don't follow the sequelize convention and thus must be explicitly declared
    timestamps: false,
  },
)

Contact.hasOne(Demographic, {
  foreignKey: {
    name: 'contact_id',
  },
})
Demographic.belongsTo(Contact, {
  foreignKey: {
    name: 'contact_id',
  },
})

const createDemographic = async function (contact_id, email, phone, address) {
  try {

    const demographic = await Demographic.create({
      contact_id: contact_id,
      email: email,
      phone: phone,
      address: address
    })

    console.log('Demographic data saved successfully.')
    return demographic
  } catch (error) {
    console.error('Error saving demographic data to the database: ', error)
  }
}

const createOrUpdateDemographic = async function (
  contact_id,
  email,
  phone,
  address,
) {
  try {
    await sequelize.transaction(
      {
        isolationLevel: Sequelize.Transaction.SERIALIZABLE,
      },
      async (t) => {
        let demographic = await Demographic.findOne({
          where: {
            contact_id: contact_id,
          },
        })

        const timestamp = Date.now()

        // (JamesKEbert) TODO: Change upsert for a better mechanism, such as locking potentially.
        if (!demographic) {
          console.log('Creating Demographic')
          const demographic = await Demographic.upsert({
            contact_id: contact_id,
            email: email,
            phone: phone,
            address: address
          })
        } else {
          console.log('Updating Demographic')
          await Demographic.update(
            {
              contact_id: contact_id,
              email: email,
              phone: phone,
              address: address
            },
            {
              where: {
                contact_id: contact_id,
              },
            },
          )
        }
      },
    )

    console.log('Demographic saved successfully.')
    return
  } catch (error) {
    console.error('Error saving demographic to the database: ', error)
  }
}

const readDemographics = async function () {
  try {
    const demographics = await Demographic.findAll({
      include: [
        {
          model: Contact,
          required: true,
        },
      ],
    })

    return demographics
  } catch (error) {
    console.error('Could not find demographics in the database: ', error)
  }
}

const readDemographic = async function (contact_id) {
  try {
    const demographic = await Demographic.findAll({
      where: {
        contact_id: contact_id,
      },
      include: [
        {
          model: Contact,
          required: true,
        },
      ],
    })

    return demographic[0]
  } catch (error) {
    console.error('Could not find demographic in the database: ', error)
  }
}

const updateDemographic = async function (contact_id, email, phone, address) {
  try {

    await Demographic.update(
      {
        contact_id: contact_id,
        email: email,
        phone: phone,
        address: address
      },
      {
        where: {
          contact_id: contact_id,
        },
      },
    )

    console.log('Demographic updated successfully.')
  } catch (error) {
    console.error('Error updating the Demographic: ', error)
  }
}

const deleteDemographic = async function (contact_id) {
  try {
    await Demographic.destroy({
      where: {
        contact_id: contact_id,
      },
    })

    console.log('Successfully deleted demographic')
  } catch (error) {
    console.error('Error while deleting demographic: ', error)
  }
}

export = {
  Demographic,
  createDemographic,
  createOrUpdateDemographic,
  readDemographic,
  readDemographics,
  updateDemographic,
  deleteDemographic,
}
