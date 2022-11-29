export{}

const ControllerError = require('./errors.ts')
const WebSocket = require('ws')

// All you need for CanUser to work
const check = require('./canUser')
const rules = require('./rbac-rules')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const logger = require('./logger')

let wss = null

function getWS() {
  if (!wss) {
    throw new Error("wss is not initialized")
  }
  return wss
}

function start() {

  logger.info('Websockets Setup')

   wss = new WebSocket.Server({noServer: true})

  // (JamesKEbert) TODO: Add a connection timeout to gracefully exit versus nginx configuration closing abrubtly
  wss.on('connection', (ws, req) => {
    logger.info('New Websocket Connection')

    let userCookieParsed = null
    let cookies = null
    let userCookie = null

    // Getting the user data from the cookie
    try {
      cookies = cookie.parse(req.headers.cookie)
      userCookie = cookieParser.signedCookie(cookies['user'])
      userCookieParsed = JSON.parse(userCookie)
      logger.debug("User cookies from ui ", userCookieParsed)
    } catch (error) {
      userCookieParsed = null
      logger.error(`Error parsing cookies in authenticated web sockets`)
      logger.error({
        name: error.name,
        message: error.message,
        cookies: cookies,
        userCookie: userCookie,
        headers: req.headers,
        headerCookie: req.headers.cookie,
        userCookieParsed: userCookieParsed
      })
    }

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message)
        logger.debug('New Websocket Message:', parsedMessage)

        messageHandler(
          ws,
          parsedMessage.context,
          parsedMessage.type,
          parsedMessage.data,
          userCookieParsed
        )
      } catch (error) {
        logger.error({name: error.name, message: error.message})
      }
    })

    ws.on('close', (code, reason) => {
      logger.info('Websocket Connection Closed', code, reason)
    })

    ws.on('ping', (data) => {
      logger.debug('Ping')
    })

    ws.isAlive = true

    ws.on('pong', (data) => {
      logger.debug('Pong')
      ws.isAlive = true
    })
  })

  // Send a ping to all connections every 30 seconds
  // and terminate those that don't respond by the next interval

  const interval = setInterval(() => {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate()

      ws.isAlive = false
      ws.ping()
    })
  }, 30000)

  wss.on('close', function close() {
    clearInterval(interval)
  })
}

// Send a message to all connected clients
const sendMessageToAll = (context, type, data = {}) => {
  try {
    logger.info(`Sending Message to all websocket clients of type: ${type}`)

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        logger.debug('Sending Message to Client')
        client.send(JSON.stringify({context, type, data}))
      } else {
        logger.debug('Client Not Ready')
      }
    })
  } catch (error) {
    logger.error('Error Sending Message to All Clients')
    throw error
  }
}

// Send an outbound message to a websocket client
const sendMessage = (ws, context, type, data = {}) => {
  logger.info(`Sending Message to websocket client of type: ${type}`)
  try {
    ws.send(JSON.stringify({context, type, data}))
  } catch (error) {
    logger.error({name: error.name, message: error.message})
    throw error
  }
}

// Send an Error Message to a websocket client
const sendErrorMessage = (ws, errorCode, errorReason) => {
  try {
    logger.info('Sending Error Message')

    sendMessage(ws, 'ERROR', 'SERVER_ERROR', {errorCode, errorReason})
  } catch (error) {
    logger.error('Error Sending Error Message to Client')
    logger.error({name: error.name, message: error.message})
  }
}

// Handle inbound messages
const messageHandler = async (ws, context, type, data, userCookieParsed) => {
  try {
    logger.info(`New Message with context: '${context}' and type: '${type}'`)
    switch (context) {
      case 'USERS':
        switch (type) {
          case 'GET_ALL':
            logger.debug("User cookies ", userCookieParsed)
            if (check(rules, userCookieParsed, 'users:read')) {
              const users = await Users.getAll()
              sendMessage(ws, 'USERS', 'USERS', {users})
            } else {
              sendMessage(ws, 'USERS', 'USER_ERROR', {
                error: 'ERROR: You are not authorized to fetch users.',
              })
            }
            break

          case 'GET':
            const user = await Users.getUser(data.user_id)
            sendMessage(ws, 'USERS', 'USERS', {users: [user]})
            break

          case 'GET_USER_BY_TOKEN':
            const userByToken = await Users.getUserByToken(data)
            sendMessage(ws, 'USERS', 'USER', {user: [userByToken]})
            break

          case 'GET_USER_BY_EMAIL':
            const userByEmail = await Users.getUserByEmail(data)
            sendMessage(ws, 'USERS', 'USER', {user: [userByEmail]})
            break

          case 'CREATE':
            if (check(rules, userCookieParsed, 'users:create')) {
              try {
                const newUser = await Users.createUser(data.organization_id, data.email, data.first_name, data.last_name, data.roles)
                sendMessage(
                  ws,
                  'USERS',
                  'USER_SUCCESS',
                  'User was successfully added!',
                )
              } catch (error){
                logger.error({name: error.name, message: error.message})
                sendMessage(ws, 'USERS', 'USER_ERROR', error)
              }
            } else {
              sendMessage(ws, 'USERS', 'USER_ERROR', {
                error: 'ERROR: You are not authorized to create users.',
              })
            }
            break

          case 'UPDATE':
            if (
              check(rules, userCookieParsed, 'users:update, users:updateRoles')
            ) {
              logger.debug(data)
              try {
                const updatedUser = await Users.updateUser(
                  data.user_id,
                  data.organization_id,
                  data.email,
                  data.password,
                  data.first_name,
                  data.last_name,
                  data.token,
                  data.roles)
                sendMessage(
                  ws,
                  'USERS',
                  'USER_SUCCESS',
                  'User was successfully updated!',
                )
              } catch (error) {
                sendMessage(ws, 'USERS', 'USER_ERROR', false)
              }

            } else {
              sendMessage(ws, 'USERS', 'USER_ERROR', {
                error: 'ERROR: You are not authorized to update users.',
              })
            }
            break

          case 'PASSWORD_UPDATE':
            if (check(rules, userCookieParsed, 'users:updatePassword')) {
              const updatedUserPassword = await Users.updatePassword(
                data.id,
                data.password,
              )
              sendMessage(ws, 'USERS', 'PASSWORD_UPDATED', {
                updatedUserPassword,
              })
            } else {
              sendMessage(ws, 'USERS', 'USER_ERROR', {
                error:
                  'ERROR: You are not authorized to update user passwords.',
              })
            }
            break

          case 'DELETE':
            if (check(rules, userCookieParsed, 'users:delete')) {
              const deletedUser = await Users.deleteUser(data)
              if (deletedUser === true) {
                logger.info('User was deleted WS')
                sendMessage(
                  ws,
                  'USERS',
                  'USER_SUCCESS',
                  'User was successfully deleted!',
                )
              } else
                sendMessage(ws, 'USERS', 'USER_ERROR', {
                  error: "ERROR: the user can't be deleted. Try again.",
                })
            } else {
              sendMessage(ws, 'USERS', 'USER_ERROR', {
                error: 'ERROR: You are not authorized to delete users.',
              })
            }
            break

          case 'RESEND_CONFIRMATION':
            if (check(rules, userCookieParsed, 'users:create')) {
              try {
                const email = await Users.resendAccountConfirmation(data)
                sendMessage(
                  ws,
                  'USERS',
                  'USER_SUCCESS',
                  'Confirmation email was successfully re-sent!',
                )
              } catch (error) {
                logger.error({name: error.name, message: error.message})
                sendMessage(ws, 'USERS', 'USER_ERROR', false)
              }

            } else {
              sendMessage(ws, 'USERS', 'USER_ERROR', {
                error:
                  'ERROR: You are not authorized to re-send confirmation emails.',
              })
            }
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

      case 'ROLES':
        switch (type) {
          case 'GET_ALL':
            if (check(rules, userCookieParsed, 'roles:read')) {
              const roles = await Roles.getAll()
              sendMessage(ws, 'ROLES', 'ROLES', {roles})
            } else {
              sendMessage(ws, 'USERS', 'USER_ERROR', {
                error: 'ERROR: You are not authorized to fetch roles.',
              })
            }
            break

          case 'GET':
            const role = await Roles.getRole(data.role_id)
            sendMessage(ws, 'ROLES', 'ROLES', {roles: [role]})
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

        case 'ORGANIZATIONS':
          switch (type) {
            case 'GET_ALL':
              if (check(rules, userCookieParsed, 'organizations:read')) {
                const organizations = await Organizations.getAll()
                sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATIONS', {organizations})
              } else {
                sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', {
                  error: 'ERROR: You are not authorized to fetch organizations.',
                })
              }
              break

            case 'GET':
              if (check(rules, userCookieParsed, 'organizations:read')) {
                const organization = await Organizations.getOrganization(data.organization_id)
                sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATIONS', {organizations: [organization]})
              } else {
                sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', {
                  error: 'ERROR: You are not authorized to fetch organizations.',
                })
              }
              break

            case 'CREATE':
              if (check(rules, userCookieParsed, 'organizations:create')) {
                const newOrganization = await Organizations.createOrganization(
                  data.name,
                  data.category,
                  data.type,
                  data.country,
                  data.jurisdiction
                )
                if (newOrganization.error) {
                  logger.error({name: newOrganization.error.name, message: newOrganization.error.message})
                  sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', newOrganization)
                } else if (newOrganization === true) {
                  sendMessage(
                    ws,
                    'ORGANIZATIONS',
                    'ORGANIZATION_SUCCESS',
                    'Organization was successfully added!',
                  )
                }
              } else {
                sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', {
                  error: 'ERROR: You are not authorized to create organizations.',
                })
              }
              break

            case 'UPDATE':
              if (
                check(rules, userCookieParsed, 'organizations:update')
              ) {
                logger.debug(data)
                const updatedOrganization = await Organizations.updateOrganization(
                  data.organization_id,
                  data.name,
                  data.category,
                  data.type,
                  data.country,
                  data.jurisdiction
                )

                if (updatedOrganization.error) {
                  sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', updatedOrganization)
                } else if (updatedOrganization === true) {
                  sendMessage(
                    ws,
                    'ORGANIZATIONS',
                    'ORGANIZATION_SUCCESS',
                    'Organization was successfully updated!',
                  )
                }
              } else {
                sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', {
                  error: 'ERROR: You are not authorized to update organizations.',
                })
              }
              break

            // Need a strategy for updating users who had this organization...
            // So we're waiting to handle this scenario later
            // case 'DELETE':
            //   if (check(rules, userCookieParsed, 'organizations:delete')) {
            //     const deletedOrganization = await Organizations.deleteOrganization(data)
            //     if (deletedOrganization === true) {
            //       console.log('Organization was deleted WS')
            //       sendMessage(
            //         ws,
            //         'ORGANIZATIONS',
            //         'ORGANIZATION_SUCCESS',
            //         'Organization was successfully deleted!',
            //       )
            //     } else
            //       sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', {
            //         error: "ERROR: the user couldn't be deleted. Please try again.",
            //       })
            //   } else {
            //     sendMessage(ws, 'ORGANIZATIONS', 'ORGANIZATION_ERROR', {
            //       error: 'ERROR: You are not authorized to delete organizations.',
            //     })
            //   }
            //   break

            default:
              logger.error(`Unrecognized Message Type: ${type}`)
              sendErrorMessage(ws, 1, 'Unrecognized Message Type')
              break
          }
          break

      case 'INVITATIONS':
        switch (type) {
          case 'CREATE_SINGLE_USE':
            if (check(rules, userCookieParsed, 'invitations:create')) {
              var invitation
              if (data.workflow) {
                invitation = await Invitations.createPersistentSingleUseInvitation(
                  data.workflow,
                )
              } else {
                invitation = await Invitations.createSingleUseInvitation()
              }
              sendMessage(ws, 'INVITATIONS', 'INVITATION', {
                invitation_record: invitation,
              })
            } else {
              sendMessage(ws, 'INVITATIONS', 'INVITATIONS_ERROR', {
                error: 'ERROR: You are not authorized to create invitations.',
              })
            }
            break

          case 'CREATE_ACCOUNT_INVITATION':
            if (check(rules, userCookieParsed, 'invitations:create')) {
              logger.debug(data.userID)
              let invitation = await Invitations.createAccountInvitation(
                data.userID,
              )
              sendMessage(ws, 'INVITATIONS', 'INVITATION', {
                invitation_record: invitation,
              })
            } else {
              sendMessage(ws, 'INVITATIONS', 'INVITATIONS_ERROR', {
                error: 'ERROR: You are not authorized to create invitations.',
              })
            }
            break

          case 'CREATE_WALLET_INVITATION':
              if (check(rules, userCookieParsed, 'invitations:create')) {
                logger.info('CREATE_WALLET_INVITATION', data.userID)
                let invitation = await Invitations.createWalletInvitation(
                  data.userID,
                )
                sendMessage(ws, 'INVITATIONS', 'INVITATION', {
                  invitation_record: invitation,
                })
              } else {
                sendMessage(ws, 'INVITATIONS', 'INVITATIONS_ERROR', {
                  error: 'ERROR: You are not authorized to create invitations.',
                })
              }
              break

          case 'ACCEPT_INVITATION':
            if (check(rules, userCookieParsed, 'invitations:accept')) {
              let invitation = await Invitations.acceptInvitation(data)

              // sendMessage(ws, 'INVITATIONS', 'INVITATION', {
              //   invitation_record: invitation,
              // })
            } else {
              sendMessage(ws, 'INVITATIONS', 'INVITATIONS_ERROR', {
                error: 'ERROR: You are not authorized to accept invitations.',
              })
            }
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

      case 'CONTACTS':
        switch (type) {
          case 'GET_ALL':
            if (check(rules, userCookieParsed, 'contacts:read')) {
              const contacts = await Contacts.getAll(data.additional_tables)
              sendMessage(ws, 'CONTACTS', 'CONTACTS', {contacts})
            } else {
              sendMessage(ws, 'CONTACTS', 'CONTACTS_ERROR', {
                error: 'ERROR: You are not authorized to fetch contacts.',
              })
            }
            break

          case 'GET':
            const contact = await Contacts.getContact(
              data.contact_id,
              data.additional_tables,
            )
            sendMessage(ws, 'CONTACTS', 'CONTACTS', {contacts: [contact]})
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

      case 'DEMOGRAPHICS':
        switch (type) {
          case 'UPDATE_OR_CREATE':
            if (
              check(
                rules,
                userCookieParsed,
                'demographics:create, demographics:update',
              )
            ) {
              await Demographics.updateOrCreateDemographic(
                data.contact_id,
                data.email,
                data.phone,
                data.address,
              )
            } else {
              sendMessage(ws, 'DEMOGRAPHICS', 'DEMOGRAPHICS_ERROR', {
                error:
                  'ERROR: You are not authorized to create or update demographics.',
              })
            }
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

      case 'PASSPORTS':
        switch (type) {
          case 'UPDATE_OR_CREATE':
            await Passports.updateOrCreatePassport(
              data.contact_id,
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
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

      case 'SETTINGS':
        switch (type) {
          case 'SET_THEME':
            if (check(rules, userCookieParsed, 'settings:update')) {
              logger.debug('SET_THEME')
              const updatedTheme = await Settings.setTheme(data)
              if (updatedTheme) {
                sendMessage(ws, 'SETTINGS', 'SETTINGS_THEME', updatedTheme)
                sendMessage(
                  ws,
                  'SETTINGS',
                  'SETTINGS_SUCCESS',
                  'Theme was successfully updated!',
                )
              } else
                sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                  error: "ERROR: theme can't be updated.",
                })
            } else {
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error: 'ERROR: You are not authorized to update the theme.',
              })
            }
            break

          case 'GET_THEME':
            logger.debug('GET_THEME')
            const currentTheme = await Settings.getTheme()
            if (currentTheme)
              sendMessage(ws, 'SETTINGS', 'SETTINGS_THEME', currentTheme)
            else
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error: "ERROR: theme couldn't be fetched.",
              })
            break

          case 'GET_SCHEMAS':
            logger.debug('GET_SCHEMAS')
            const currentSchemas = await Settings.getSchemas()
            if (currentSchemas)
              sendMessage(ws, 'SETTINGS', 'SETTINGS_SCHEMAS', currentSchemas)
            else
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error: "ERROR: Credential schemas couldn't be fetched.",
              })
            break

          case 'SET_SMTP':
            if (check(rules, userCookieParsed, 'settings:update')) {
              logger.debug('SET_SMTP')
              const updatedSMTP = await Settings.setSMTP(data)
              if (updatedSMTP)
                sendMessage(
                  ws,
                  'SETTINGS',
                  'SETTINGS_SUCCESS',
                  'SMTP was successfully updated!',
                )
              else
                sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                  error: "ERROR: SMTP can't be updated.",
                })
            } else {
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error:
                  'ERROR: You are not authorized to update SMTP configurations.',
              })
            }
            break

          case 'SET_ORGANIZATION_NAME':
            if (check(rules, userCookieParsed, 'settings:update')) {
              logger.debug('SET_ORGANIZATION_NAME')
              const updatedOrganization = await Settings.setOrganization(data)
              if (updatedOrganization) {
                sendMessage(
                  ws,
                  'SETTINGS',
                  'SETTINGS_ORGANIZATION',
                  updatedOrganization.value,
                )
                sendMessage(
                  ws,
                  'SETTINGS',
                  'SETTINGS_SUCCESS',
                  'Organization name was successfully updated!',
                )
              } else
                sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                  error: "ERROR: organization name can't be updated.",
                })
            } else {
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error:
                  'ERROR: You are not authorized to update the organization name.',
              })
            }
            break

          case 'GET_ORGANIZATION_NAME':
            logger.debug('GET_ORGANIZATION_NAME')
            const currentOrganization = await Settings.getOrganization()
            if (currentOrganization)
              sendMessage(
                ws,
                'SETTINGS',
                'SETTINGS_ORGANIZATION',
                currentOrganization.value,
              )
            else
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error: "ERROR: organization name couldn't be fetched.",
              })
            break
        }
        break

      case 'IMAGES':
        switch (type) {
          case 'SET_LOGO':
            if (check(rules, userCookieParsed, 'settings:update')) {
              logger.debug('SET_LOGO')
              // console.log(data)
              const newImage = await Images.setImage(
                data.name,
                data.type,
                data.image,
              )
              if (newImage.error) {
                sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', newImage)
              } else {
                sendMessage(ws, 'SETTINGS', 'LOGO', newImage[0])
                sendMessage(
                  ws,
                  'SETTINGS',
                  'SETTINGS_SUCCESS',
                  'Logo was successfully updated!',
                )
              }
            } else {
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error: 'ERROR: You are not authorized to update the logo.',
              })
            }
            break

          default:
            logger.debug('GET_IMAGES')
            const images = await Images.getAll()
            if (images) sendMessage(ws, 'SETTINGS', 'LOGO', images[0])
            else
              sendMessage(ws, 'SETTINGS', 'SETTINGS_ERROR', {
                error: "ERROR: images couldn't be fetched.",
              })
            break
        }
        break

      case 'EMISSION_PRESENTATION':
        switch (type) {
          case 'PUSH':
            // const getUser = await Users.getUserByEmail(data.email)
            // if (!getUser.user_id) {
            //   sendMessage(ws, 'USERS', 'USER_ERROR', getUser)
            // }
            // console.log("User ", getUser)
            try {
              const conn = await Connections.readConnectionByTheirDID(data.did)
              if (conn.connection_id){
                // await Presentations.requestPresentation(getLatestConn.connection_id)
                AdminAPI.Presentations.requestPresentation(
                  conn.connection_id,
                  ['facility_emissions_scope1_co2e', 'credential_reporting_date_start', 'credential_reporting_date_end', 'facility_name', 'organization_name', 'facility_country', 'facility_jurisdiction'],
                  '',
                  'Requesting Presentation',
                  false,
                )
              }
            } catch(error) {
              logger.error({name: error.name, message: error.message})
              sendMessage(ws, 'EMISSION_PRESENTATION', 'PRESENTATION_FAILED', {
                error: `ERROR: ${error}`
              })
            }
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

      case 'CREDENTIALS':
        switch (type) {
          case 'ISSUE_USING_SCHEMA':
            if (check(rules, userCookieParsed, 'credentials:issue')) {
              await Credentials.autoIssueCredential(
                data.connectionID,
                data.issuerDID,
                data.credDefID,
                data.schemaID,
                data.schemaVersion,
                data.schemaName,
                data.schemaIssuerDID,
                data.comment,
                data.attributes,
              )
            } else {
              sendMessage(ws, 'CREDENTIALS', 'CREDENTIALS_ERROR', {
                error: 'ERROR: You are not authorized to issue credentials.',
              })
            }
            break

          case 'GET':
            const credentialRecord = await Credentials.getCredential(
              data.credential_exchange_id,
            )
            sendMessage(ws, 'CREDENTIALS', 'CREDENTIALS', {
              credential_records: [credentialRecord],
            })
            break

          case 'GET_ALL':
            const credentialRecords = await Credentials.getAll()
            sendMessage(ws, 'CREDENTIALS', 'CREDENTIALS', {
              credential_records: credentialRecords,
            })
            break

          default:
            logger.error(`Unrecognized Message Type: ${type}`)
            sendErrorMessage(ws, 1, 'Unrecognized Message Type')
            break
        }
        break

      default:
        logger.error(`Unrecognized Message Context: ${context}`)
        sendErrorMessage(ws, 1, 'Unrecognized Message Context')
        break
    }
  } catch (error) {
    if (error instanceof ControllerError) {
      logger.error('Controller Error in Message Handling', error)
      sendErrorMessage(ws, error.code, error.reason)
    } else {
      logger.error('Error In Websocket Message Handling', error)
      sendErrorMessage(ws, 0, 'Internal Error')
    }
  }
}

module.exports = {
  sendMessageToAll,
  start,
  wss,
  getWS
}

const Invitations = require('./agentLogic/invitations')
const Demographics = require('./agentLogic/demographics')
const Passports = require('./agentLogic/passports')
const Contacts = require('./agentLogic/contacts')
const Credentials = require('./agentLogic/credentials')
const Images = require('./agentLogic/images')
const Settings = require('./agentLogic/settings')
import { assert } from 'console'
import { ExceptionHandler } from 'winston'
import * as Users from './agentLogic/users'
const Roles = require('./agentLogic/roles')
const Organizations = require('./agentLogic/organizations')
const Connections = require('./orm/connections')
const Presentations = require('./agentLogic/presentations.ts')
const AdminAPI = require('./adminAPI')
