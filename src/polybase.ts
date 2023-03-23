import { Password, WALLET_PRIV_KEY } from "./types";

let priv_key: string | undefined = undefined;
chrome.storage.session.onChanged.addListener((e) => {
  if (e[WALLET_PRIV_KEY]) {
    priv_key = e[WALLET_PRIV_KEY].newValue;
  }
});
export const get_passwords = (): Password[] => {
  return [
    {
      password: "1234",
      username: "thisisommore",
      website: "www.ommore.me",
    },
    {
      password: "study karo",
      username: "thisisommore",
      website: "github.com",
    },
    {
      password: "1234",
      username: "thisisommoremax",
      website: "github.com",
    },
  ];
};
