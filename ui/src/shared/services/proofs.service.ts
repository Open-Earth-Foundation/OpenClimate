import IProof from "../../api/models/DTO/Proof/Proof";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function saveProofCredDef(userID: string, credID: string) {
  return fetch(`${ServerUrls.api}/proof/${userID}/${credID}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then(CommonHelper.HandleResponse);
}

function readProofCredDef(userID: string, credID: string) {
  return fetch(`${ServerUrls.api}/proof/${userID}/${credID}/get`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((proof) => {
      return proof;
    });
}

export const proofsService = {
  saveProofCredDef,
  readProofCredDef,
};
