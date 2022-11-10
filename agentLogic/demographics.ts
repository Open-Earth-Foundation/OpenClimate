const Websockets = require('../websockets.ts')

let ContactsCompiled = require('../orm/contactsCompiled.ts')
let Demographics = require('../orm/demographics.ts')

const updateOrCreateDemographic = async function (
  contact_id,
  email,
  phone,
  address,
) {
  try {
    await Demographics.createOrUpdateDemographic(
      contact_id,
      email,
      phone,
      address,
    )

    const contact = await ContactsCompiled.readContact(contact_id, [
      'Demographic',
      'Passport',
    ])

    Websockets.sendMessageToAll('CONTACTS', 'CONTACTS', {contacts: [contact]})
  } catch (error) {
    console.error('Error Fetching Contacts')
    throw error
  }
}

export = {
  updateOrCreateDemographic,
}
