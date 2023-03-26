import { createRecord, getAllRecords, getRecordByUrl } from "./polybase";
import { CurrentParams, GetPasswords, Message, MessageKey } from "./types";

const current_params: CurrentParams = {
  password: "",
  username: "",
  website: "",
};

let passwords_for_requested_website: Data[] = [];

let tried_save_pass = 0;
chrome.tabs.onUpdated.addListener((id, change, tab) => {
  const change_url = change.url?.replace(/\/+$/, "");

  if (change_url && current_params.website) {
    const url_parsed = new URL(change_url);
    const current_url_parsed = new URL(current_params.website);
    console.log(change_url, current_params.website);

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
      console.log("schedulig=ng");

      setTimeout(() => {
        console.log("sending now");
        console.log(
          "https://" + new URL(current_params.website).hostname + "/*"
        );
        chrome.tabs.query(
          {
            active: true,
            url: "https://" + new URL(current_params.website).hostname + "/*",
          },
          async function (tabs) {
            if (!tabs.length) throw new Error("Tab not found");
            try {
              await send_message_to_tab(tabs?.[0]?.id ?? 0, new_message);
            } catch (error) {
              if (tried_save_pass == 0) {
                tried_save_pass++;
                setTimeout(async () => {
                  await send_message_to_tab(tabs?.[0]?.id ?? 0, new_message);
                }, 4000);
              }
            }
          }
        );
      }, 2000);
    }
  }
});

const send_message_to_tab = async (tabId: number, m: Message<any>) => {
  return await chrome.tabs.sendMessage(tabId, m);
};

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

type SendRes = (res: any) => void;
const handle_chrome_messages = async (m: Message<any>, sendRes: SendRes) => {
  if (m.key == MessageKey.GET_PASSWORDS) {
    const body = m.body as GetPasswords;
    passwords_for_requested_website = await getRecordByUrl(body.domain);

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
    const url_obj = new URL(current_params.website);

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
};
chrome.runtime.onMessage.addListener((m, _, s) => {
  handle_chrome_messages(m, s).then(s);
  return true;
});
