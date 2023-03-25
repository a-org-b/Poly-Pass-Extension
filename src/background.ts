import { createRecord, getAllRecords, getRecordByUrl } from "./polybase";
import {
  CurrentParams,
  GetPasswords,
  Message,
  MessageKey,
  Password,
} from "./types";

const current_params: CurrentParams = {
  password: "",
  username: "",
  website: "",
};

let passwords_for_requested_website: Data[];

chrome.tabs.onUpdated.addListener((id, change, tab) => {
  const change_url = change.url?.replace(/\/+$/, "");

  if (change_url && current_params.website) {
    const url_parsed = new URL(change_url);
    const current_url_parsed = new URL(current_params.website);
    if (
      url_parsed.hostname == current_url_parsed.hostname &&
      change_url != current_params.website &&
      current_params.username &&
      current_params.password
    ) {
      const new_message: Message<any> = {
        key: MessageKey.LOGIN_SUCCESS,
      };

      let exist = passwords_for_requested_website.find((e) => {
        const params_website = new URL(current_params.website).hostname;

        return (
          e.password == current_params.password &&
          e.username == current_params.username &&
          e.url == params_website
        );
      });

      if (exist) return;
      setTimeout(() => {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs?.[0].id ?? 0, new_message);
          }
        );
      }, 300);
    }
  }
});
export interface Data {
  id: string;
  password: string;
  publicKey: PublicKey;
  url: string;
  username: string;
}

export interface PublicKey {
  alg: string;
  crv: string;
  kty: string;
  use: string;
  x: string;
  y: string;
}
chrome.runtime.onMessage.addListener(async (m: Message<any>, _, sendRes) => {
  console.log("messag rec", m);

  if (m.key == MessageKey.GET_PASSWORDS) {
    const body = m.body as GetPasswords;
    const passwords = await getRecordByUrl(body.domain);
    passwords_for_requested_website = passwords.data.map((e) => e.data);

    sendRes(passwords_for_requested_website);
    return true;
  }
  if (m.key == MessageKey.PARAMS_UPDATED) {
    const body = m.body as CurrentParams;
    current_params.username = body.username;
    current_params.password = body.password;
    current_params.website = body.website.replace(/\/+$/, "");
    return true;
  }
  if (m.key == MessageKey.SAVE_PASSWORD) {
    console.log(current_params.website);

    const url_obj = new URL(current_params.website);
    console.log("saving pasword", {
      a: current_params.username,
      b: current_params.password,
      c: url_obj.hostname,
    });

    await createRecord(
      current_params.username,
      current_params.password,
      url_obj.hostname
    );
    current_params.website = "";
    current_params.username = "";
    current_params.password = "";
    return true;
  }
  return false;
});
