import { CurrentParams, LOGIN_SUCCESS, Message, PARAMS_UPDATED } from "./types";

const current_params: CurrentParams = {
  password: "",
  username: "",
  website: "",
};

chrome.tabs.onUpdated.addListener((id, change, tab) => {
  const change_url = change.url?.replace(/\/+$/, "");
  if (change_url && current_params.website) {
    const url_parsed = new URL(change_url);
    const current_url_parsed = new URL(current_params.website);

    console.log("passed inside check");
    console.log(url_parsed.hostname, current_url_parsed.hostname);

    if (
      url_parsed.hostname == current_url_parsed.hostname &&
      change_url != current_params.website &&
      current_params.username &&
      current_params.password
    ) {
      const new_message: Message<any> = {
        key: LOGIN_SUCCESS,
      };
      console.log("sending msg after 2s");

      setTimeout(() => {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs?.[0].id ?? 0, new_message);
            current_params.website=""
            current_params.username=""
            current_params.password=""

          }
        );
      }, 2000);
    }
  }
});

chrome.runtime.onMessage.addListener((m: Message<any>) => {
  console.log(m);
  if (m.key == PARAMS_UPDATED) {
    const body = m.body as CurrentParams;
    current_params.username = body.username;
    current_params.password = body.password;
    current_params.website = body.website.replace(/\/+$/, "");
  }
});
