import { Password } from "./types";

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
