const {Sequelize, DataTypes, Model} = require('sequelize')

const init = require('./init.ts')
const sequelize = init.connect()
const logger = require('../logger').child({module: __filename})

const {Contact} = require('./contacts.ts')

class Passport extends Model {}

Passport.init(
  {
    contact_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    passport_number: {
      type: DataTypes.TEXT,
    },
    surname: {
      type: DataTypes.TEXT,
    },
    given_names: {
      type: DataTypes.TEXT,
    },
    sex: {
      type: DataTypes.TEXT,
    },
    date_of_birth: {
      type: DataTypes.TEXT,
    },
    place_of_birth: {
      type: DataTypes.TEXT,
    },
    nationality: {
      type: DataTypes.TEXT,
    },
    date_of_issue: {
      type: DataTypes.TEXT,
    },
    date_of_expiration: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.TEXT,
    },
    code: {
      type: DataTypes.TEXT,
    },
    authority: {
      type: DataTypes.TEXT,
    },
    photo: {
      type: DataTypes.BLOB,
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
    modelName: 'Passport',
    tableName: 'passports',
    timestamps: false,
  },
)

Contact.hasOne(Passport, {
  foreignKey: {
    name: 'contact_id',
  },
})
Passport.belongsTo(Contact, {
  foreignKey: {
    name: 'contact_id',
  },
})

const createPassport = async function (
  contact_id,
  passport_number,
  surname,
  given_names,
  sex,
  date_of_birth,
  place_of_birth,
  nationality,
  date_of_issue,
  date_of_expiration,
  type,
  code,
  authority,
  photo,
) {
  try {
    const timestamp = Date.now()

    const passport = await Passport.create({
      contact_id: contact_id,
      passport_number: passport_number,
      surname: surname,
      given_names: given_names,
      sex: sex,
      date_of_birth: date_of_birth,
      place_of_birth: place_of_birth,
      nationality: nationality,
      date_of_issue: date_of_issue,
      date_of_expiration: date_of_expiration,
      type: type,
      code: code,
      authority: authority,
      photo: photo,
      created_at: timestamp,
      updated_at: timestamp,
    })
    logger.debug('Passport data saved successfully.')
    return passport
  } catch (error) {
    logger.error('Error saving passport data to database: ', error)
  }
}
const createOrUpdatePassport = async function (
  contact_id,
  passport_number,
  surname,
  given_names,
  sex,
  date_of_birth,
  place_of_birth,
  nationality,
  date_of_issue,
  date_of_expiration,
  type,
  code,
  authority,
  photo,
) {
  try {
    await sequelize.transaction(
      {
        isolationLevel: Sequelize.Transaction.SERIALIZABLE,
      },
      async (t) => {
        let passport = await Passport.findOne({
          where: {
            contact_id: contact_id,
          },
        })
        const timestamp = Date.now()

        if (!passport) {
          logger.debug('Creating Passport')
          const passport = await Passport.upsert({
            contact_id: contact_id,
            passport_number: passport_number,
            surname: surname,
            given_names: given_names,
            sex: sex,
            date_of_birth: date_of_birth,
            place_of_birth: place_of_birth,
            nationality: nationality,
            date_of_issue: date_of_issue,
            date_of_expiration: date_of_expiration,
            type: type,
            code: code,
            authority: authority,
            photo: photo,
            created_at: timestamp,
            updated_at: timestamp,
          })
        } else {
          logger.debug('Updating Passport')
          await Passport.update(
            {
              contact_id: contact_id,
              passport_number: passport_number,
              surname: surname,
              given_names: given_names,
              sex: sex,
              date_of_birth: date_of_birth,
              place_of_birth: place_of_birth,
              nationality: nationality,
              date_of_issue: date_of_issue,
              date_of_expiration: date_of_expiration,
              type: type,
              code: code,
              authority: authority,
              photo: photo,
              created_at: timestamp,
              updated_at: timestamp,
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
    logger.debug('Passport saved successfully')
    return
  } catch (error) {
    logger.error('Error saving passport to database: ', error)
  }
}

const readPassports = async function () {
  try {
    const passports = await Passport.findAll({
      include: [
        {
          model: Contact,
          require: true,
        },
      ],
    })
    return passports
  } catch (error) {
    logger.error('Could not find passports in the database: ', error)
  }
}

const readPassport = async function (contact_id) {
  try {
    const passport = await Passport.findAll({
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
    return passport[0]
  } catch (error) {
    logger.error('Could not find passport in database: ', error)
  }
}

const updatePassport = async function (
  contact_id,
  passport_number,
  surname,
  given_names,
  sex,
  date_of_birth,
  place_of_birth,
  nationality,
  date_of_issue,
  date_of_expiration,
  type,
  code,
  authority,
  photo,
) {
  try {
    const timestamp = Date.now()

    await Passport.update(
      {
        contact_id: contact_id,
        passport_number: passport_number,
        surname: surname,
        given_names: given_names,
        sex: sex,
        date_of_birth: date_of_birth,
        place_of_birth: place_of_birth,
        nationality: nationality,
        date_of_issue: date_of_issue,
        date_of_expiration: date_of_expiration,
        type: type,
        code: code,
        authority: authority,
        photo: photo,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        where: {
          contact_id: contact_id,
        },
      },
    )
    logger.debug('Passport updated successfully.')
  } catch (error) {
    logger.error('Error updating the Passport: ', error)
  }
}

const deletePassport = async function (contact_id) {
  try {
    await Passport.destroy({
      where: {
        contact_id: contact_id,
      },
    })
    logger.debug('Successfully deleted passport')
  } catch (error) {
    logger.error('Error while deleting passport: ', error)
  }
}

export = {
  Passport,
  createPassport,
  createOrUpdatePassport,
  readPassports,
  readPassport,
  updatePassport,
  deletePassport,
}
