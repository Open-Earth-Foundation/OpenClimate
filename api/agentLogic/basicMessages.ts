const Websockets = require("../websockets.ts");

const Presentations = require("./presentations");
const logger = require("../logger").child({ module: __filename });

const adminMessage = async (message) => {
  logger.debug("New Basic Message");

  // Connection Reuse Method
  switch (message.content) {
    case "test_id":
      logger.debug("Connection Request Employee Workflow");

      await Websockets.sendMessageToAll("INVITATIONS", "SINGLE_USE_USED", {
        workflow: message.content,
        connection_id: message.connection_id,
      });

      break;
    case "test_result":
      logger.debug("Connection Request Immunization Workflow");

      await Websockets.sendMessageToAll("INVITATIONS", "SINGLE_USE_USED", {
        workflow: message.content,
        connection_id: message.connection_id,
      });

      // Send Presentation Request
      await Presentations.requestPresentation(message.connection_id);

      break;
    default:
      console.warn("Regular Basic Message:", message.content);
      return;
  }
};

export = {
  adminMessage,
};
