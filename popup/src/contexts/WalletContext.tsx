import { Wallet } from "ethers";
import React, { useMemo, useState } from "react";
import { get_wallet_from_local } from "../wallet/wallet";

type WalletContextType = {
  wallet: Wallet | undefined;
  lock: () => void;
  unlock: (password: string) => void;
};
export let WalletContext: React.Context<WalletContextType>;

export function WalletProvider(props: React.PropsWithChildren) {
  const [wallet, set_wallet] = useState<Wallet>();
  const lock = () => {
    set_wallet(undefined);
  };

  const unlock = async (password: string) => {
    try {
      const wallet = await get_wallet_from_local(password);
      set_wallet(wallet);
    } catch (error) {
      throw error;
    }
  };

  const value: WalletContextType = useMemo(
    () => ({
      wallet,
      lock,
      unlock,
    }),
    [wallet]
  );

  WalletContext = React.createContext(value);

  return (
    <WalletContext.Provider value={value}>
      {props.children}
    </WalletContext.Provider>
  );
}
