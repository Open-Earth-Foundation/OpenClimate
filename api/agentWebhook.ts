const Websockets = require('./websockets.ts')

const express = require('express')

// We use one Winston instance for the entire app

const logger = require('./logger').child({module: __filename})

const router = express.Router()

const Contacts = require('./agentLogic/contacts.ts')
const Credentials = require('./agentLogic/credentials.ts')
const Demographics = require('./agentLogic/demographics.ts')
const Passports = require('./agentLogic/passports.ts')
const BasicMessages = require('./agentLogic/basicMessages.ts')
const Presentations = require('./agentLogic/presentations.ts')

router.post('/topic/connections', async (req, res, next) => {
  logger.debug('Aries Cloud Agent Webhook Message----Connection------')

  logger.debug('Connection Details:')
  const connectionMessage = req.body
  logger.debug(connectionMessage)

  res.status(200).send('Ok')

  await Contacts.adminMessage(connectionMessage)
})

router.post('/topic/issue_credential', async (req, res, next) => {
  logger.debug('Aries Cloud Agent Webhook Message----Credential Issuance------')

  logger.debug('Issuance Details:')
  const issuanceMessage = req.body
  logger.debug(issuanceMessage)

  res.status(200).send('Ok')

  await Credentials.adminMessage(issuanceMessage)
})

router.post('/topic/present_proof', async (req, res, next) => {
  logger.debug('Aries Cloud Agent Webhook Message----Presentations------')

  logger.debug('Presentation Details:')
  const presMessage = req.body
  logger.debug(presMessage)

  res.status(200).send('Ok')
  await Presentations.adminMessage(presMessage)
})

router.post('/topic/basicmessages', async (req, res, next) => {
  logger.debug('Aries Cloud Agent Webhook Message----Basic Message------')

  logger.debug('Message Details:')
  const basicMessage = req.body
  logger.debug(basicMessage)

  res.status(200).send('Ok')

  await BasicMessages.adminMessage(basicMessage)
})

router.post('/topic/data-transfer', async (req, res, next) => {
  logger.debug('Aries Cloud Agent Webhook Message----Data Transfer------')

  console.warn('No Goal Code Found')

  res.status(200).send('Ok')
})

router.post('/topic/data-transfer/:goalCode', async (req, res, next) => {
  logger.debug(
    'Aries Cloud Agent Webhook Message----Data Transfer goalCode------',
  )

  logger.debug('Message Details:', req.params.goalCode)
  if (req.params.goalCode === 'transfer.demographicdata') {
    let connection_id = req.body.connection_id
    let data = req.body.data[0].data.json

    let contact = await Contacts.getContactByConnection(connection_id, [])

    Demographics.updateOrCreateDemographic(
      contact.contact_id,
      data.email,
      data.phone,
      data.address,
    )
  } else if (req.params.goalCode === 'transfer.passportdata') {
    let connection_id = req.body.connection_id
    let data = req.body.data[0].data.json

    let contact = await Contacts.getContactByConnection(connection_id, [])

    Passports.updateOrCreatePassport(
      contact.contact_id,
      data.passport_number,
      data.surname,
      data.given_names,
      data.sex,
      data.date_of_birth,
      data.place_of_birth,
      data.nationality,
      data.date_of_issue,
      data.date_of_expiration,
      data.type,
      data.code,
      data.authority,
      data.photo,
    )
    // logger.debug(req.body.data[0].data.json)
  } else {
  }

  res.status(200).send('Ok')
})

module.exports = router
