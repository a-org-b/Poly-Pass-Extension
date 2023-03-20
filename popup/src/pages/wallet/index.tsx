import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";

const Wallet = () => {
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);
  useEffect(() => {
    console.log(wallet_context);

    if (!wallet_context.wallet) {
      navigate("/unlock");
    }
  }, [wallet_context, navigate]);
  return <div>{wallet_context.wallet?.address}</div>;
};

export default Wallet;
