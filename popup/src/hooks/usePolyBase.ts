import { useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";

type Password = {
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
    ];
  };

  return { get_passwords };
};
