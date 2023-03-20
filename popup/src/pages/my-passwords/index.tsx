import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";

const MyPasswords = () => {
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);
  useEffect(() => {
    if (!wallet_context.wallet) navigate("/unlock");
  }, [wallet_context]);
  return <div>MyPasswords</div>;
};

export default MyPasswords;
