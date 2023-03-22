import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";

const MyPasswords = () => {
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);

  const check = async ()=>{
    const _wallet = wallet_context.wallet?? await wallet_context.load_wallet_from_session()
    if (!_wallet) navigate("/unlock");
  }
  useEffect(() => {
    check()
  }, [wallet_context]);
  return <div>MyPasswords</div>;
};

export default MyPasswords;
