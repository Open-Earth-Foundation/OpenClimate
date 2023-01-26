const jwt = require("jsonwebtoken");

const ControllerError = require("./errors.ts");
const WebSocket = require("ws");
const logger = require("./logger").child({ module: __filename });

let connectionIDWebSocket = [];
let awss = null;

function getWS() {
  if (!awss) {
    throw new Error("awss is not initialized");
  }
  return awss;
}

function start() {
  logger.info("Anon websocket start");

  awss = new WebSocket.Server({ noServer: true });

  // (JamesKEbert) TODO: Add a connection timeout to gracefully exit versus nginx configuration closing abrubtly
  awss.on("connection", (ws, req) => {
    logger.info("New Anon Websocket Connection");
    ws.connection_ids = [];

    // store the connection_ids associated with the connection
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        logger.info("New Anon Websocket Message:", parsedMessage);

        messageHandler(
          ws,
          parsedMessage.context,
          parsedMessage.type,
          parsedMessage.data
        );
      } catch (error) {
        logger.error({ name: error.name, message: error.message });
      }
    });

    ws.on("close", (code, reason) => {
      logger.info("Anon Websocket Connection Closed", code, reason);

      ws.connection_ids.forEach(
        (connection_id) => delete connectionIDWebSocket[connection_id]
      );
    });

    ws.on("ping", (data) => {
      logger.debug("Ping");
    });

    ws.isAlive = true;

    ws.on("pong", (data) => {
      logger.debug("Pong");
      ws.isAlive = true;
    });
  });

  // Send a ping to all connections every 30 seconds
  // and terminate those that don't respond by the next interval

  const interval = setInterval(() => {
    awss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  awss.on("close", function close() {
    clearInterval(interval);
  });
}

const checkWebsocketID = (connectionID) => {
  logger.debug(connectionID);
  logger.debug(connectionIDWebSocket);
  logger.debug(connectionID in connectionIDWebSocket);
  logger.debug("Check to see if we have this anonymous websocket connection");
  return connectionID in connectionIDWebSocket;
};

// Send a message to all connected clients
const sendMessageToAll = (context, type, data = {}) => {
  try {
    logger.debug(
      `Sending Message to all anon websocket clients of type: ${type}`
    );

    awss.clients.forEach(function each(client) {
      if (client.type != "anon") {
        return;
      }
      if (client.readyState === WebSocket.OPEN) {
        logger.debug("Sending Message to Client");
        client.send(JSON.stringify({ context, type, data }));
      } else {
        logger.debug("Client Not Ready");
      }
    });
  } catch (error) {
    logger.error("Error Sending Message to All Clients");
    throw error;
  }
};

const sendMessageToConnectionId = (connection_id, context, type, data = {}) => {
  let ws = connectionIDWebSocket[connection_id];

  logger.debug(`Sending Message to anon websocket client of type: ${type}`);
  try {
    if (ws) {
      ws.send(JSON.stringify({ context, type, data }));
    }
  } catch (error) {
    logger.error({ name: error.name, message: error.message });
    throw error;
  }
};

// Send an outbound message to a websocket client
const sendMessage = (ws, context, type, data = {}) => {
  logger.debug(`Sending Message to anon websocket client of type: ${type}`);
  try {
    ws.send(JSON.stringify({ context, type, data }));
  } catch (error) {
    logger.error({ name: error.name, message: error.message });
    throw error;
  }
};

// Send an Error Message to a websocket client
const sendErrorMessage = (ws, errorCode, errorReason) => {
  try {
    logger.debug("Sending Error Message");

    sendMessage(ws, "ERROR", "SERVER_ERROR", { errorCode, errorReason });
  } catch (error) {
    logger.error("Error Sending Error Message to Client");
    logger.error({ name: error.name, message: error.message });
  }
};

// Handle inbound messages
interface Data {
  token: string;
  email: string;
  roles: string[];
}

const messageHandler = async (ws, context, type, data = <Data>{}) => {
  try {
    logger.debug(`New Message with context: '${context}' and type: '${type}'`);

    switch (context) {
      case "INVITATIONS":
        switch (type) {
          case "CREATE_SINGLE_USE":
            var invitation;
            invitation = await Invitations.createSingleUseInvitation();
            ws.connection_ids.push(invitation.connection_id);
            connectionIDWebSocket[invitation.connection_id] = ws;

            sendMessage(ws, "INVITATIONS", "INVITATION", {
              invitation_record: invitation,
            });
            break;

          case "CREATE_ACCOUNT_INVITATION":
            if (data.token) {
              try {
                logger.debug("JWT_SECRET", process.env.JWT_SECRET);
                logger.debug("TOKEN", data.token);
                const verify = jwt.verify(data.token, process.env.JWT_SECRET);
                logger.debug("The token is valid.");

                const user = await Users.getUserByToken(data.token);
                let invitation = await Invitations.createAccountInvitation(
                  user.user_id
                );

                ws.connection_ids.push(invitation.connection_id);
                connectionIDWebSocket[invitation.connection_id] = ws;

                sendMessage(ws, "INVITATIONS", "INVITATION", {
                  invitation_record: invitation,
                });
              } catch (error) {
                sendMessage(ws, "INVITATIONS", "INVITATIONS_ERROR", {
                  error: "ERROR: You have an invalid invitation.",
                });
                throw error;
              }
            } else {
              sendMessage(ws, "INVITATIONS", "INVITATIONS_ERROR", {
                error: "ERROR: You have an invalid invitation.",
              });
            }
            break;

          default:
            logger.error(`Unrecognized Message Type: ${type}`);
            sendErrorMessage(ws, 1, "Unrecognized Message Type");
            break;
        }
        break;

      case "USERS":
        switch (type) {
          case "CREATE":
            const newUser = await Users.createUser(data.email, data.roles);
            if (newUser.error) {
              logger.debug(newUser.error);
              sendMessage(ws, "USERS", "USER_ERROR", newUser);
            } else if (newUser === true) {
              sendMessage(
                ws,
                "USERS",
                "USER_SUCCESS",
                "User was successfully added!"
              );
            }
            break;

          default:
            logger.error(`Unrecognized Message Type: ${type}`);
            sendErrorMessage(ws, 1, "Unrecognized Message Type");
            break;
        }
        break;
      default:
        logger.error(`Unrecognized Message Context: ${context}`);
        sendErrorMessage(ws, 1, "Unrecognized Message Context");
        break;
    }
  } catch (error) {
    if (error instanceof ControllerError) {
      logger.error("Controller Error in Message Handling", error);
      sendErrorMessage(ws, error.code, error.reason);
    } else {
      logger.error("Error In Anon Websocket Message Handling", error);
      sendErrorMessage(ws, 0, "Internal Error");
    }
  }
};

module.exports = {
  checkWebsocketID,
  sendMessageToAll,
  sendMessageToConnectionId,
  start,
  getWS,
  awss,
};

const Users = require("./agentLogic/users");
const Invitations = require("./agentLogic/invitations");

export {};
