const Websockets = require('../websockets.ts')

let ContactsCompiled = require('../orm/contactsCompiled.ts')
let Passports = require('../orm/passports.ts')
const logger = require('../logger').child({module: __filename})

const updateOrCreatePassport = async function (
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
    await Passports.createOrUpdatePassport(
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
    )

    const contact = await ContactsCompiled.readContact(contact_id, [
      'Demographic',
      'Passport',
    ])

    Websockets.sendMessageToAll('CONTACTS', 'CONTACTS', {contacts: [contact]})
  } catch (error) {
    logger.error('Error Fetching Contacts')
    throw error
  }
}

export = {
  updateOrCreatePassport,
}
