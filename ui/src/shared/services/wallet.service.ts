import IWallet from "../../api/models/DTO/Wallet/IWallet";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function saveWallet(orgId: string, wallet: IWallet) {
  return fetch(`${ServerUrls.api}/wallet/${orgId}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wallet),
  }).then(CommonHelper.HandleResponse);
}

function allWalletsByOrg(orgId: string) {
  return fetch(`${ServerUrls.api}/${orgId}/wallets`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((wallets: Array<IWallet>) => {
      return wallets;
    });
}

export const walletService = {
  saveWallet,
  allWalletsByOrg,
};
