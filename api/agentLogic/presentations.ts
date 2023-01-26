import { json } from "body-parser";
import { Stream } from "stream";

const AdminAPI = require("../adminAPI");
const Websockets = require("../websockets.ts");
const AnonWebsockets = require("../anonwebsockets.ts");

let Connections = require("../orm/connections");
let Wallets = require("../orm/registered_wallets");
let TrustedRegistry = require("../orm/trusted_registry");
let Users = require("../orm/users");
let Proofs = require("../orm/proofs");

const logger = require("../logger").child({ module: __filename });

const requestPresentation = async (connectionID) => {
  logger.debug(`Requesting Presentation from Connection: ${connectionID}`);

  AdminAPI.Presentations.requestPresentation(
    connectionID,
    ["address"],
    process.env.SCHEMA_VALIDATED_EMAIL,
    "Requesting Presentation",
    false
  );
};

interface Value {
  address: Address;
  organization_name: string;
}

interface OrgVerificationCreds {
  organization_name: AttrParams;
  registration_date: AttrParams;
  organization_id: AttrParams;
}

interface Scope1Creds {
  facility_jurisdiction: AttrParams;
  credential_reporting_date_start: AttrParams;
  credential_reporting_date_end: AttrParams;
  facility_country: AttrParams;
  facility_name: AttrParams;
  organization_name: AttrParams;
  facility_emissions_scope1_co2e: AttrParams;
  credential_issuer?: AttrParams;
  credential_issuer_name?: AttrParams;
  cred_def_id?: AttrParams;
}

interface AttrParams {
  sub_proof_index: number;
  raw: string;
  encoded: string;
}
interface Address {
  raw: string;
}

function isAttrParams(obj: any): obj is AttrParams {
  return (
    obj != null &&
    typeof obj.sub_proof_index === "number" &&
    typeof obj.raw === "string" &&
    typeof obj.encoded === "string"
  );
}

function isOrgVerificationCreds(obj: any): obj is OrgVerificationCreds {
  return (
    obj != null &&
    isAttrParams(obj.organization_name) &&
    isAttrParams(obj.registration_date) &&
    isAttrParams(obj.organization_id)
  );
}

function isScope1Creds(obj: any): obj is Scope1Creds {
  return (
    obj != null &&
    isAttrParams(obj.facility_jurisdiction) &&
    isAttrParams(obj.credential_reporting_date_start) &&
    isAttrParams(obj.credential_reporting_date_end) &&
    isAttrParams(obj.facility_country) &&
    isAttrParams(obj.facility_name) &&
    isAttrParams(obj.organization_name) &&
    isAttrParams(obj.facility_emissions_scope1_co2e)
  );
}

const adminMessage = async (message) => {
  logger.debug("Received Presentations Message", message);

  if (message.state === "verified") {
    // Check if proof DID is in our trusted registry
    logger.debug(
      "Received Presentations DID",
      message.presentation.identifiers[0].cred_def_id
    );

    const cred_issuer = await TrustedRegistry.readTrustedDID(
      message.presentation.identifiers[0].cred_def_id.split(":")[0]
    );
    if (cred_issuer) {
      logger.debug("DID verified", cred_issuer);
      if (AnonWebsockets.checkWebsocketID(message.connection_id)) {
        let values: Value;
        // (mikekebert) Check the data format to see if the presentation requires the referrant pattern
        if (message.presentation.requested_proof.revealed_attr_groups) {
          values =
            message.presentation.requested_proof.revealed_attr_groups[
              Object.keys(
                message.presentation.requested_proof.revealed_attr_groups
              )[0] // Get first group available
            ].values; // TODO: this needs to be a for-in loop or similar later
        } else {
          values = message.presentation.requested_proof.revealed_attrs;
        }

        if (values.address) {
          // Now that we have verified the credential, we need to add a user_id to the connection
          const user = await Users.readUserByEmail(values.address.raw);
          const connection = await Connections.readConnection(
            message.connection_id
          );

          Connections.updateConnection(
            connection.connection_id,
            connection.state,
            connection.my_did,
            connection.alias,
            connection.request_id,
            connection.invitation_key,
            connection.invitation_mode,
            connection.invitation_url,
            connection.invitation,
            connection.accept,
            connection.initiator,
            connection.their_role,
            connection.their_did,
            connection.their_label,
            connection.routing_state,
            connection.inbound_connection_id,
            connection.error_msg,
            user.user_id // <-- the user ID from the user needs to go here
          );

          // We tell people that we verified the email address
          AnonWebsockets.sendMessageToConnectionId(
            message.connection_id,
            "PRESENTATIONS",
            "VERIFIED",
            {
              address: values.address,
            }
          );

          // Finally, we request the next presentation
          AdminAPI.Presentations.requestPresentation(
            message.connection_id,
            ["organization_name", "access_role"],
            process.env.SCHEMA_VERIFIED_EMPLOYEE,
            "Requesting Presentation",
            false
          );
        }

        if (values.organization_name) {
          // We also need to validate the organization and send a message
          AnonWebsockets.sendMessageToConnectionId(
            message.connection_id,
            "PRESENTATIONS",
            "VERIFIED",
            {
              organization_name: values.organization_name,
            }
          );
        }
      } else {
        logger.debug(
          "Message ",
          message.presentation.requested_proof.revealed_attrs
        );

        if (
          isScope1Creds(message.presentation.requested_proof.revealed_attrs)
        ) {
          let Scope1Creds: Scope1Creds =
            message.presentation.requested_proof.revealed_attrs;
          Scope1Creds.credential_issuer = {
            sub_proof_index: 0,
            raw: cred_issuer.did,
            encoded: cred_issuer.did,
          };
          Scope1Creds.credential_issuer_name = {
            sub_proof_index: 0,
            raw: cred_issuer.organization_name,
            encoded: cred_issuer.organization_name,
          };
          Scope1Creds.cred_def_id = {
            sub_proof_index: 0,
            raw: message.presentation.identifiers[0].cred_def_id,
            encoded: message.presentation.identifiers[0].cred_def_id,
          };
          await Websockets.sendMessageToAll("EMISSIONS", "RECEIVED", {
            facility_emissions_scope1_co2e: Scope1Creds,
          });
        }

        if (
          isOrgVerificationCreds(
            message.presentation.requested_proof.revealed_attrs
          )
        ) {
          const connection = await Connections.readConnection(
            message.connection_id
          );
          const user = await Users.readUser(connection.user_id);
          const wallet = await Wallets.addWallet(
            connection.their_did,
            user.user_id
          );
          await Websockets.sendMessageToAll("WALLET", "ACCEPTED", {
            wallet: wallet,
          });
        }
      }
    } else {
      Websockets.sendMessageToAll("PRESENTATIONS", "VERIFICATION_FAILED", {
        connection_id: message.connection_id,
        error: "DID isnt trusted",
      });
    }
  }
};

export = {
  adminMessage,
  requestPresentation,
};
