import { Wallet } from "ethers";
import React, { useEffect, useState } from "react";
import { get_wallet_from_local, get_wallet_from_session, set_wallet_to_session } from "../wallet/wallet";

type WalletContextType = {
  wallet: Wallet | undefined;
  lock: () => void;
  unlock: (password: string) => Promise<void>;
  count: number;
  get_wallet:()=>Promise<Wallet|undefined>
};
export let WalletContext: React.Context<WalletContextType>;

export function WalletProvider(props: React.PropsWithChildren) {

  const [wallet, set_wallet] = useState<Wallet>();
  const [count, set_count] = useState(0);
  const lock = () => {
    set_wallet(undefined);
  };

  const get_wallet = async ():Promise<Wallet|undefined>=>{
    return wallet ?? await load_wallet_from_session()
  }

  const load_wallet_from_session = async ():Promise<Wallet|undefined>=>{
    try {
      const _wallet = await get_wallet_from_session()
      set_wallet(_wallet)
      return _wallet
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    load_wallet_from_session()
  },[])

  const unlock = async (password: string) => {
    try {
      const _wallet = await get_wallet_from_local(password);
      set_wallet(_wallet);
      await set_wallet_to_session(_wallet)
      set_count(count + 1);
    } catch (error) {
      throw error;
    }
  };

  const value: WalletContextType = {
    wallet,
    lock,
    unlock,
    count,
    get_wallet
  };

  WalletContext = React.createContext(value);

  return (
    <WalletContext.Provider value={value}>
      {props.children}
    </WalletContext.Provider>
  );
}
