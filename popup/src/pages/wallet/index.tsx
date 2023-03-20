import React, { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";

const Wallet = () => {
  const wallet_context = useContext(WalletContext);
  return <div>{wallet_context.wallet?.address}</div>;
};

export default Wallet;
