import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";

const MyPasswords = () => {
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);

  const check = async ()=>{
    if (!await wallet_context.get_wallet()) navigate("/unlock");
  }
  useEffect(() => {
    check()
  }, [wallet_context]);
  return <div>MyPasswords</div>;
};

export default MyPasswords;
