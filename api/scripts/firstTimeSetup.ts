// @ts-nocheck
import * as readline from "readline";

// Import Environment Variables for use via an .env file in a non-containerized context
const dotenv = require("dotenv");
dotenv.config();

const CredDefs = require("../agentLogic/credDefs");
const DIDs = require("../agentLogic/dids");
const Invitations = require("../agentLogic/invitations");
const Ledger = require("../agentLogic/ledger");

console.log("Setting Up Enterprise Agent");

const setup = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Perform TAA Agreement
  const TAA = await Ledger.fetchTAA();

  if (TAA.taa_record) {
    let agreement = false;

    rl.write(
      `Read the following Transaction Author Agreement:, \n ${TAA.taa_record.text} \n\n\n\n`
    );
    rl.question(
      "Do you agree to the above Transaction Author Agreement? y/n: ",
      (response) => {
        console.log("Entered ", response);
        if (
          response === "y" ||
          response === "Y" ||
          response === "yes" ||
          response === "Yes"
        ) {
          rl.write("You've Agreed to the Transaction Author Agreement");
          agreement = true;

          rl.close();
        } else if (response === "n" || response === "N") {
          rl.write(
            "You have not agreed to the Transaction Author Agreement, please cease use of the Enterprise Application\n"
          );
          agreement = false;
          rl.close();
        } else {
          rl.write(
            "Unrecognized Answer, you have not agreed to the Transaction Author Agreement, please cease use of the Enterprise Application\n"
          );
          agreement = false;
          rl.close();
        }
      }
    );

    rl.on("close", async () => {
      if (!agreement) {
        throw new Error("TAA Not Accepted");
      }

      // Perform TAA Agreement
      await Ledger.acceptTAA(
        TAA.taa_record.version,
        TAA.taa_record.text,
        "wallet_agreement"
      );

      await ledgerWrites();
    });
  } else {
    rl.write("No Transaction Author Agreement present on network\n\n");
    await ledgerWrites();
  }
};

const ledgerWrites = async () => {
  // Create a Public DID
  const did = await DIDs.createDID();

  const rlDID = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rlDID.write(
    `The following DID Has Been Generated For You: \n\n DID: ${did.did} \n\n Verkey: ${did.verkey}\n\n`
  );
  rlDID.question(
    "Have you anchored the above DID (such as via the selfserve.indiciotech.io or selfserve.sovrin.org)? y/n: ",
    async (response) => {
      if (
        response === "y" ||
        response === "Y" ||
        response === "yes" ||
        response === "Yes"
      ) {
        rlDID.write("Continuing...\n");

        await DIDs.setPublicDID(did.did);

        rlDID.close();
      } else if (response === "n" || response === "N") {
        rlDID.write("Aborting...\n");
        throw new Error("DID Not Anchored");
        rlDID.close();
      } else {
        rlDID.write("Unrecognized Answer, Aborting...\n");
        throw new Error("DID Not Anchored");
        rlDID.close();
      }
    }
  );

  rlDID.on("close", async () => {
    // Create Cred Def
    let credDefIDs = [];
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        process.env.SCHEMA_VALIDATED_EMAIL
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        process.env.SCHEMA_VERIFIED_EMPLOYEE
      )
    );

    // credDefIDs.push(
    //   await CredDefs.createCredDef(
    //     'default',
    //     'WFZtS6jVBp23b4oDQo6JXP:2:Carbon_Intensity:1.0',
    //   ),
    // )

    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_1:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_2:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_3:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_1_Mitigations:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Carbon_Intensity_level:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Carbon_Intensity_Reduction:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Target_emission_level:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Target_emission_reduction:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "5cmzU3vtyQAXcRqerHikmM:2:Site_Facility:1.0"
      )
    );
    credDefIDs.push(
      await CredDefs.createCredDef(
        "default",
        "WFZtS6jVBp23b4oDQo6JXP:2:Transfers:1.0"
      )
    );

    const rlCred = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // rlCred.write(
    //   `The following Credential Definition(s) Have Been Generated For You:\n\n`,
    // )
    // let credDefs = await credDefIDs.join(', ')
    // rlCred.write(`${credDefs} \n\n`)

    // rlCred.write(`Generating an Invitation for Use in Connection Reuse...\n\n`)

    // const invitation = await Invitations.createSingleUseInvitation(
    //   '_CONNECTION_REUSE_INVITATION',
    //   true,
    //   true,
    //   false,
    // )

    // rlCred.write(`Generated the Above Invitation..\n\n`)

    // rlCred.write(
    //   `You should likely add the following key to the governance framework document: ${invitation.invitation.recipientKeys[0]}\n\n`,
    // )

    rlCred.question(
      "Completed. Press enter to continue... \n",
      async (response) => {
        rlCred.close();
      }
    );

    rlCred.on("close", async () => {
      console.log("Continuing...\n");

      console.log("Finished Setup");
      process.exit(0);
    });
  });
};

process.on("uncaughtException", function (error) {
  if (error.code === "EADDRINUSE") {
    console.log(
      "Script Tried to Start Websocket Server that was already running, continuing..."
    );
  } else {
    console.log(error);
    process.exit(1);
  }
});

process.on("unhandledRejection", function (reason, promise) {
  console.log(reason);
  process.exit(1);
});

setup();
