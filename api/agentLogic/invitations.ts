const AdminAPI = require('../adminAPI')

const logger = require('../logger').child({module: __filename})

let Connections = require('../orm/connections.ts')
import {Utils} from '../util'
// Perform Agent Business Logic

// Create an invitation
const createSingleUseInvitation = async (
  alias = 'default',
  autoAccept = true,
  multiUse = false,
  public_ = false,
  business_wallet = false,
) => {
  try {
    const invitationMessage = await AdminAPI.Connections.createInvitation(
      alias,
      autoAccept,
      multiUse,
      public_,
    )
    logger.debug(invitationMessage)

    await Connections.createOrUpdateConnection(
      invitationMessage.connection_id,
      'invitation',
      null,
      invitationMessage.alias,
      null,
      null,
      null,
      invitationMessage.invitation_url,
      invitationMessage.invitation,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      business_wallet
    )

    // (JamesKEbert) TODO: Strategy of invitations, specifically broadcasting to users
    const invitation = await Connections.readConnection(
      invitationMessage.connection_id,
    )

    // Return to the user that triggered the generation of that invitation
    return invitation
  } catch (error) {
    logger.error('Error Creating Invitation')
    throw error
  }
}

// Create Single Use Invitation that supports Connection reuse
// (JamesKEbert) TODO: We've created a function for connection reuse, some stop gaps specific to overall project. Should move to using Public DIDs for this purpose, or build the capability in ACA-Py to generate invitations from a specific local-DID to allow key recognition from a client for connection reuse
const createPersistentSingleUseInvitation = async (workflow = 'test_id') => {
  try {
    logger.debug(
      `Creating/fetching reusable invitation with workflow ${workflow}`,
    )

    let reuseInvite = await Connections.readInvitationByAlias(
      '_CONNECTION_REUSE_INVITATION',
    )

    logger.debug(reuseInvite)

    let alteredInvitationRecord = {
      ...reuseInvite.dataValues,
    }

    alteredInvitationRecord.invitation['workflow'] = workflow

    let invitationJSON = JSON.stringify(alteredInvitationRecord.invitation)
    const invitationString =
      alteredInvitationRecord.invitation.serviceEndpoint +
      '?c_i=' +
      Utils.encodeBase64(invitationJSON)

    logger.debug(invitationString)
    alteredInvitationRecord.invitation_url = invitationString

    // Return to the user that triggered the generation of that invitation
    return alteredInvitationRecord
  } catch (error) {
    logger.error('Error Creating Invitation')
    throw error
  }
}

const acceptInvitation = async (invitation_url) => {
  try {
    // Decoding the invitation url
    const url = new URL(invitation_url)
    const encodedParam = url.searchParams.get('c_i')
    const buff = Buffer.from(encodedParam, 'base64')
    const decodedInvitation = buff.toString('utf-8')

    const invitationMessage = await AdminAPI.Connections.acceptInvitation(
      decodedInvitation,
    )

    // Return some info about the new connection formed by accepting the invite so we can take further action
    return invitationMessage
  } catch (error) {
    logger.error('Error Accepting Invitation')
    throw error
  }
}

const createAccountInvitation = async (
  userID,
  alias = 'default',
  autoAccept = true,
  multiUse = false,
  public_ = false,
  business_wallet = false,
) => {
  try {
    const invitationMessage = await AdminAPI.Connections.createInvitation(
      alias,
      autoAccept,
      multiUse,
      public_,
    )
    logger.debug(invitationMessage)

    await Connections.createOrUpdateConnection(
      invitationMessage.connection_id,
      'invitation',
      null,
      invitationMessage.alias,
      null,
      null,
      null,
      invitationMessage.invitation_url,
      invitationMessage.invitation,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      userID,
      business_wallet
    )

    // (JamesKEbert) TODO: Strategy of invitations, specifically broadcasting to users
    const invitation = await Connections.readConnection(
      invitationMessage.connection_id,
    )

    // Return to the user that triggered the generation of that invitation
    return invitation
  } catch (error) {
    logger.error('Error Creating Invitation')
    throw error
  }
}

const createWalletInvitation = async (
  userID,
  alias = 'default',
  autoAccept = true,
  multiUse = false,
  public_ = false,
  business_wallet = true,
) => {
  try {
    const invitationMessage = await AdminAPI.Connections.createInvitation(
      alias,
      autoAccept,
      multiUse,
      public_,
    )
    logger.debug(invitationMessage)

    await Connections.createOrUpdateConnection(
      invitationMessage.connection_id,
      'invitation',
      null,
      invitationMessage.alias,
      null,
      null,
      null,
      invitationMessage.invitation_url,
      invitationMessage.invitation,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      userID,
      business_wallet
    )

    // (JamesKEbert) TODO: Strategy of invitations, specifically broadcasting to users
    const invitation = await Connections.readConnection(
      invitationMessage.connection_id,
    )

    // Return to the user that triggered the generation of that invitation
    return invitation
  } catch (error) {
    logger.error('Error Creating Invitation')
    throw error
  }
}

export = {
  createSingleUseInvitation,
  createPersistentSingleUseInvitation,
  acceptInvitation,
  createAccountInvitation,
  createWalletInvitation
}
