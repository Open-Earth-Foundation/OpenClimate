const crypto = require("crypto");
const sendAdminMessage = require("./transport");
const logger = require("../logger").child({ module: __filename });

// Generate operations and requests to be sent to the Cloud Agent Adminstration API

const requestPresentation = async (
  connectionID,
  attributes = [],
  schemaID,
  comment = "Requesting Presentation",
  trace = false
) => {
  try {
    logger.debug(`Requesting Presentation from Connection: ${connectionID}`);

    let nonce = crypto.randomBytes(40).join("");

    let requestedAttributes = {};
    for (var i = 0; i < attributes.length; i++) {
      requestedAttributes[attributes[i]] = {
        name: attributes[i],
        // schema passed in should adhere to env variables and be used in BCovrin Network
        restrictions: [{ schema_id: schemaID }],
      };
    }

    const presentationRequest = {
      trace: trace,
      comment: comment,
      proof_request: {
        nonce: nonce,
        requested_predicates: {},
        requested_attributes: requestedAttributes,
        /* Requested Attributes:
            {
            "attribute_name": {
              "name": "attribute_name",
              "restrictions":[
                {"schema_id": "XDfTygX4ZrbdSr1HiBqef1:2:Schema_Name:1.0"}
              ]
            },
          }
          */
        name: "Proof request",
        version: "1.0",
      },
      connection_id: connectionID,
    };

    logger.debug(presentationRequest);

    const response = await sendAdminMessage(
      "post",
      `/present-proof/send-request`,
      {},
      presentationRequest
    );

    logger.debug(response);

    return response;
  } catch (error) {
    logger.error("Presentations Error");
    throw error;
  }
};

export = {
  requestPresentation,
};
