const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {v4: uuid} = require('uuid')

const AdminAPI = require('../adminAPI')
const Websockets = require('../websockets')
const AnonWebsockets = require('../anonwebsockets')

let Connections = require('../orm/connections')
let Contacts = require('../orm/contacts')
let ContactsCompiled = require('../orm/contactsCompiled')
let Users = require('../orm/users')

const logger = require('../logger').child({module: __filename})

// Perform Agent Business Logic

// Fetch an existing connection
export async function fetchConnection (connectionID) {
  try {
    // (JamesKEbert) TODO:Change to use Controller DB versus Admin API Call
    const connection = await AdminAPI.Connections.fetchConnection(connectionID)

    return connection
  } catch (error) {
    logger.error('Error Fetching Connection')
    throw error
  }
}

export async function getContact (contactID, additionalTables) {
  try {
    const contact = await ContactsCompiled.readContact(
      contactID,
      additionalTables,
    )

    logger.debug('Contact:', contact)

    return contact
  } catch (error) {
    logger.error('Error Fetching Contact')
    throw error
  }
}

export async function getContactByConnection (connectionID, additionalTables) {
  try {
    const contact = await ContactsCompiled.readContactByConnection(
      connectionID,
      additionalTables,
    )

    logger.debug('Contact:', contact)

    return contact
  } catch (error) {
    logger.error('Error Fetching Contact')
    throw error
  }
}

export async function getAll (additionalTables) {
  try {
    const contacts = await ContactsCompiled.readContacts(additionalTables)

    logger.debug('Got All Contacts')

    return contacts
  } catch (error) {
    logger.error('Error Fetching Contacts')
    throw error
  }
}

export async function adminMessage (connectionMessage) {
  try {
    logger.debug('Received new Admin Webhook Message', connectionMessage)

    if (connectionMessage.state === 'invitation') {
      logger.debug('State - Invitation')

      await Connections.createOrUpdateConnection(
        connectionMessage.connection_id,
        connectionMessage.state,
        connectionMessage.my_did,
        connectionMessage.alias,
        connectionMessage.request_id,
        connectionMessage.invitation_key,
        connectionMessage.invitation_mode,
        connectionMessage.invitation_url,
        connectionMessage.invitation,
        connectionMessage.accept,
        connectionMessage.initiator,
        connectionMessage.their_role,
        connectionMessage.their_did,
        connectionMessage.their_label,
        connectionMessage.routing_state,
        connectionMessage.inbound_connection_id,
        connectionMessage.error_msg,
      )
      // Broadcast the invitation in the invitation agent logic
      return
    }

    var contact

    if (connectionMessage.state === 'request') {
      logger.debug('State - Request')
      logger.debug('Creating Contact')

      contact = await Contacts.createContact(
        connectionMessage.their_label, // label
        {}, // meta_data
      )

      await Connections.updateConnection(
        connectionMessage.connection_id,
        connectionMessage.state,
        connectionMessage.my_did,
        connectionMessage.alias,
        connectionMessage.request_id,
        connectionMessage.invitation_key,
        connectionMessage.invitation_mode,
        connectionMessage.invitation_url,
        connectionMessage.invitation,
        connectionMessage.accept,
        connectionMessage.initiator,
        connectionMessage.their_role,
        connectionMessage.their_did,
        connectionMessage.their_label,
        connectionMessage.routing_state,
        connectionMessage.inbound_connection_id,
        connectionMessage.error_msg,
      )

      await Connections.linkContactAndConnection(
        contact.contact_id,
        connectionMessage.connection_id,
      )
    } else {
      logger.debug('State - Response or later')
      await Connections.updateConnection(
        connectionMessage.connection_id,
        connectionMessage.state,
        connectionMessage.my_did,
        connectionMessage.alias,
        connectionMessage.request_id,
        connectionMessage.invitation_key,
        connectionMessage.invitation_mode,
        connectionMessage.invitation_url,
        connectionMessage.invitation,
        connectionMessage.accept,
        connectionMessage.initiator,
        connectionMessage.their_role,
        connectionMessage.their_did,
        connectionMessage.their_label,
        connectionMessage.routing_state,
        connectionMessage.inbound_connection_id,
        connectionMessage.error_msg,
      )



      if (connectionMessage.state === "active"){
        logger.debug("Connection active")
        const connection = await Connections.readConnection(
          connectionMessage.connection_id,
        )
        await Websockets.sendMessageToAll('WALLET', 'WALLET_CONNECTION_SUCCESS', {did: connectionMessage.their_did})
        // Do we have a user ID associated with this connection?
        if (connection.user_id && connection.business_wallet) {
          await AdminAPI.Presentations.requestPresentation(
            connection.connection_id,
            ['organization_name', 'registration_date', 'organization_id'],
            '',
            'Requesting Presentation',
            false,
          )
        }
        await Websockets.sendMessageToAll('WALLET', 'WALLET_PROOF_SENT', {did: connectionMessage.their_did})
      }
    }

    contact = await ContactsCompiled.readContactByConnection(
      connectionMessage.connection_id,
      ['Demographic', 'Passport'],
    )

    Websockets.sendMessageToAll('CONTACTS', 'CONTACTS', {contacts: [contact]})
    AnonWebsockets.sendMessageToConnectionId(
      connectionMessage.connection_id,
      'CONTACTS',
      'CONTACTS',
      {contacts: [contact]},
    )

    if (connectionMessage.state === 'active')
    {
      // Do we have a user ID associated with this connection?
      const connection = await Connections.readConnection(
        connectionMessage.connection_id,
      )
      logger.debug("Connection", connection)
      if (connection.user_id && !connection.business_wallet) {
        // If we have a user ID:
        const user = await Users.readUser(connection.user_id)
        if (user) {
          // 1/2 Offer an email credential
          let attributes = [
            {
              name: 'local_part',
              value: user.email.split('@')[0],
            },
            {
              name: 'domain',
              value: user.email.split('@')[1],
            },
            {
              name: 'address',
              value: user.email,
            },
            {
              name: 'date_validated',
              value: new Date().toISOString().split('T')[0],
            },
          ]

          const emailSchema = process.env.SCHEMA_VALIDATED_EMAIL
          const emailSchemaParts = emailSchema.split(':')

          await Credentials.autoIssueCredential(
            connectionMessage.connection_id,
            undefined,
            undefined,
            emailSchema,
            emailSchemaParts[3],
            emailSchemaParts[2],
            emailSchemaParts[0],
            'Account Credential',
            attributes,
          )

          // logger.debug("Issued an email credential!")
          // logger.debug("Issuing an organization credential!")
          // logger.debug("User ", user)

          // 2/2 Offer an organization credential
          attributes = [
            {
              name: 'organization_name',
              value: user.Organization.dataValues.name || ''
            },
            {
              name: 'date_validated',
              value: user.dataValues.created_at || ''
            },
            {
              name: 'access_role',
              value: user.Roles[0].dataValues.role_name ? user.Roles[0].dataValues.role_name : ''
            },
            {
              name: 'user_name',
              value: user.dataValues.first_name+" "+user.dataValues.last_name || ''
            }
          ]

          const employeeSchema = process.env.SCHEMA_VERIFIED_EMPLOYEE
          const employeeSchemaParts = employeeSchema.split(':')

          // logger.debug("Attributes:")
          // logger.debug(attributes)

          await Credentials.autoIssueCredential(
            connectionMessage.connection_id,
            undefined,
            undefined,
            employeeSchema,
            employeeSchemaParts[3],
            employeeSchemaParts[2],
            employeeSchemaParts[0],
            'Verified Employee',
            attributes,
          )
        }
      } else if (
        AnonWebsockets.checkWebsocketID(connectionMessage.connection_id)
      ) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        // If we don't have a user ID, then it's a login attempt
        // and we should request a presentation of an email credential
        // AND an organization credential
        await Presentations.requestPresentation(connectionMessage.connection_id)
      } else {
        // For some reason, we have a connection in the response phase
        // AND we don't have an AnonWebsocket connection that matches
        logger.debug("Warning: Indeterminate connection situation")
      }
    }
  } catch (error) {
    logger.error('Error Storing Connection Message')
    throw error
  }
}

let Credentials = require('./credentials')
let Presentations = require('./presentations')
