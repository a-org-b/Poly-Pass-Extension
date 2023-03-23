import { useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";

export type Password = {
  website: string;
  username: string;
  password: string;
};
export const usePolyBase = () => {
  const { wallet } = useContext(WalletContext);

  const get_passwords = (): Password[] => {
    return [
      {
        password: "1234",
        username: "thisisommore",
        website: "www.ommore.me",
      },
      {
        password: "1234",
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

  return { get_passwords };
};
