import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";
import { usePolyBase } from "../../hooks/usePolyBase";

const Wallet = () => {
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);
  const {get_passwords}=usePolyBase()
  useEffect(() => {
    if (!wallet_context.wallet) {
      navigate("/unlock");
    }
    
  }, [wallet_context, navigate]);
  return <div>{wallet_context.wallet?.address}</div>;
};

export default Wallet;
