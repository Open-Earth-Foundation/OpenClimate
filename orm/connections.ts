import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op, Transaction} from 'sequelize';

const { Contact, readBaseContact } = require('./contacts.ts')

const init = require('./init.ts')
let sequelize = init.connect()
const logger = require('../logger').child({module: __filename})

class Connection extends Model <InferAttributes<Connection>, InferCreationAttributes<Connection>> {
  declare connection_id: CreationOptional<number>;
  declare state: string;
  declare my_did: string;
  declare alias: string;
  declare request_id: string;
  declare invitation_key: string;
  declare invitation_mode: string;
  declare invitation_url: string;
  declare invitation: string;
  declare accept: string;
  declare initiator: string;
  declare their_role: string;
  declare their_did: string;
  declare their_label: string;
  declare routing_state: string;
  declare inbound_connection_id: string;
  declare error_msg: string;
  declare user_id: string;
  declare business_wallet: boolean;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: Date;
  // updatedAt can be undefined during creation
  declare updated_at: Date;
}

Connection.init(
  {
    connection_id: {
      type: DataTypes.TEXT,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    state: {
      type: DataTypes.TEXT,
    },
    my_did: {
      type: DataTypes.TEXT,
    },
    alias: {
      type: DataTypes.TEXT,
    },
    request_id: {
      type: DataTypes.TEXT,
    },
    invitation_key: {
      type: DataTypes.TEXT,
    },
    invitation_mode: {
      type: DataTypes.TEXT,
    },
    invitation_url: {
      type: DataTypes.TEXT,
    },
    invitation: {
      type: DataTypes.JSON,
    },
    accept: {
      type: DataTypes.TEXT,
    },
    initiator: {
      type: DataTypes.TEXT,
    },
    their_role: {
      type: DataTypes.TEXT,
    },
    their_did: {
      type: DataTypes.TEXT,
    },
    their_label: {
      type: DataTypes.TEXT,
    },
    routing_state: {
      type: DataTypes.TEXT,
    },
    inbound_connection_id: {
      type: DataTypes.TEXT,
    },
    error_msg: {
      type: DataTypes.TEXT,
    },
    user_id: {type: DataTypes.TEXT, allowNull: true},
    business_wallet: {type: DataTypes.BOOLEAN},
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: 'Connection',
    tableName: 'connections', // Our table names don't follow the sequelize convention and thus must be explicitly declared
    timestamps: false,
  },
)

const Contact_Connection = sequelize.define(
  'connections_to_contacts',
  {
    contact_id: DataTypes.INTEGER,
    connection_id: DataTypes.TEXT,
  },
  {
    timestamps: false,
  },
)

Contact.belongsToMany(Connection, {
  through: Contact_Connection,
  foreignKey: 'contact_id',
  otherKey: 'connection_id',
})
Connection.belongsToMany(Contact, {
  through: Contact_Connection,
  foreignKey: 'connection_id',
  otherKey: 'contact_id',
})

const createConnection = async function (
  connection_id,
  state,
  my_did,
  alias,
  request_id,
  invitation_key,
  invitation_mode,
  invitation_url,
  invitation,
  accept,
  initiator,
  their_role,
  their_did,
  their_label,
  routing_state,
  inbound_connection_id,
  error_msg,
) {
  try {
    const timestamp = new Date()

    const connection = await Connection.create({
      connection_id: connection_id,
      state: state,
      my_did: my_did,
      alias: alias,
      request_id: request_id,
      invitation_key: invitation_key,
      invitation_mode: invitation_mode,
      invitation_url: invitation_url,
      invitation: invitation,
      accept: accept,
      initiator: initiator,
      their_role: their_role,
      their_did: their_did,
      their_label: their_label,
      routing_state: routing_state,
      inbound_connection_id: inbound_connection_id,
      error_msg: error_msg,
      created_at: timestamp,
      updated_at: timestamp
    })

    logger.debug('Connection saved successfully.')
    return connection
  } catch (error) {
    logger.error('Error saving connection to the database: ', error)
  }
}

const createOrUpdateConnection = async function (
  connection_id,
  state,
  my_did,
  alias,
  request_id,
  invitation_key,
  invitation_mode,
  invitation_url,
  invitation,
  accept,
  initiator,
  their_role,
  their_did,
  their_label,
  routing_state,
  inbound_connection_id,
  error_msg,
  user_id,
  business_wallet
) {
  try {
    const connection = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async (t) => {
        let connection = await Connection.findOne({
          where: {
            connection_id: connection_id,
          },
        })

        const timestamp = new Date()

        // (JamesKEbert) TODO: Change upsert for a better mechanism, such as locking potentially.
        if (!connection) {
          logger.debug('Creating Connection')
          let connection = await Connection.upsert({
            connection_id: connection_id,
            state: state,
            my_did: my_did,
            alias: alias,
            request_id: request_id,
            invitation_key: invitation_key,
            invitation_mode: invitation_mode,
            invitation_url: invitation_url,
            invitation: invitation,
            accept: accept,
            initiator: initiator,
            their_role: their_role,
            their_did: their_did,
            their_label: their_label,
            routing_state: routing_state,
            inbound_connection_id: inbound_connection_id,
            error_msg: error_msg,
            user_id: user_id,
            business_wallet: business_wallet,
            created_at: timestamp,
            updated_at: timestamp
          })
        } else {
          logger.debug('Updating Connection')
          let connection = await Connection.update(
            {
              connection_id: connection_id,
              state: state,
              my_did: my_did,
              alias: alias,
              request_id: request_id,
              invitation_key: invitation_key,
              invitation_mode: invitation_mode,
              invitation_url: invitation_url,
              invitation: invitation,
              accept: accept,
              initiator: initiator,
              their_role: their_role,
              their_did: their_did,
              their_label: their_label,
              routing_state: routing_state,
              inbound_connection_id: inbound_connection_id,
              error_msg: error_msg,
              user_id: user_id,
              business_wallet: business_wallet,
              updated_at: timestamp
            },
            {
              where: {
                connection_id: connection_id,
              },
            },
          )
        }

        return connection
      },
    )

    logger.debug('Connection saved successfully.')
    return connection
  } catch (error) {
    logger.error('Error saving connection to the database: ', error)
    throw error
  }
}

const linkContactAndConnection = async function (contact_id, connection_id) {
  try {
    const contact = await readBaseContact(contact_id)
    const connection = await readConnection(connection_id)
    await contact.addConnection(connection, {})

    logger.debug('Successfully linked contact and connection')
  } catch (error) {
    logger.error('Error linking contact and connection', error)
    throw error
  }
}

const readConnection = async function (connection_id) {
  try {
    const connection = await Connection.findAll({
      where: {
        connection_id: connection_id,
      },
      include: [
        {
          model: Contact,
          required: false,
        },
      ],
    })

    return connection[0]
  } catch (error) {
    logger.error('Could not find connection in the database: ', error)
    throw error
  }
}

const readConnectionByUserId = async function(userId) {
  try {
    const connection = await Connection.findAll({
      limit: 1,
      where: {
        user_id: userId.toString()
      },
      order: [ [ 'updated_at', 'DESC' ]]
    })
    return connection[0]
  } catch (error) {
    logger.error('Could not find connection in the database: ', error)
    throw error
  }
}

const readConnectionByTheirDID = async function(did) {
  try {
    const connection = await Connection.findAll({
      limit: 1,
      where: {
        their_did: did
      },
    })
    return connection[0]
  } catch (error) {
    logger.error('Could not find connection in the database: ', error)
    throw error
  }
}

const readConnections = async function () {
  try {
    const connections = await Connection.findAll({
      include: [
        {
          model: Contact,
          required: false,
        },
      ],
    })

    return connections
  } catch (error) {
    logger.error('Could not find connections in the database: ', error)
    throw error
  }
}

const readInvitations = async function (connection_id) {
  try {
    const invitations = await Connection.findAll({
      where: {
        state: 'invitation',
      },
    })

    logger.debug('All invitations:', JSON.stringify(invitations, null, 2))
    return invitations
  } catch (error) {
    logger.error('Could not find connection in the database: ', error)
    throw error
  }
}

const readInvitationByAlias = async function (alias) {
  try {
    const connection = await Connection.findAll({
      where: {
        state: 'invitation',
        alias,
      },
    })

    logger.debug('Requested Invitation:', JSON.stringify(connection[0], null, 2))
    return connection[0]
  } catch (error) {
    logger.error('Could not find invitation in the database: ', error)
    throw error
  }
}

const updateConnection = async function (
  connection_id,
  state,
  my_did,
  alias,
  request_id,
  invitation_key,
  invitation_mode,
  invitation_url,
  invitation,
  accept,
  initiator,
  their_role,
  their_did,
  their_label,
  routing_state,
  inbound_connection_id,
  error_msg,
  user_id
) {
  try {
    const timestamp = new Date()

    const connection = await Connection.update(
      {
        connection_id: connection_id,
        state: state,
        my_did: my_did,
        alias: alias,
        request_id: request_id,
        invitation_key: invitation_key,
        invitation_mode: invitation_mode,
        invitation_url: invitation_url,
        invitation: invitation,
        accept: accept,
        initiator: initiator,
        their_role: their_role,
        their_did: their_did,
        their_label: their_label,
        routing_state: routing_state,
        inbound_connection_id: inbound_connection_id,
        error_msg: error_msg,
        user_id: user_id,
        updated_at: timestamp
      },
      {
        where: {
          connection_id: connection_id,
        },
      },
    )

    logger.debug('Connection updated successfully.')
    return connection
  } catch (error) {
    logger.error('Error updating the Connection: ', error)
  }
}

const deleteConnection = async function (connection_id) {
  try {
    await Connection.destroy({
      where: {
        connection_id: connection_id,
      },
    })

    logger.debug('Successfully deleted connection')
  } catch (error) {
    logger.error('Error while deleting connection: ', error)
  }
}

export = {
  Connection,
  createConnection,
  createOrUpdateConnection,
  linkContactAndConnection,
  readConnection,
  readConnectionByUserId,
  readConnections,
  readInvitationByAlias,
  readInvitations,
  updateConnection,
  deleteConnection,
  readConnectionByTheirDID
}
