import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLinkClickHandler } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";
import { wallet_exist } from "../../wallet/wallet";

const Unlock = () => {
  const [password, set_password] = useState("");
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);

  const go_to_wallet = () => navigate("/wallet");
  useEffect(() => {
    if(wallet_context.wallet) navigate("/wallet")
    if (!wallet_exist()) go_to_wallet()
  }, []);
  const on_unlock = async () => {
    wallet_context.unlock(password).then(go_to_wallet);
  };
  return (
    <div>
      Unlock
      <input
        type="password"
        placeholder="password"
        onChange={(e) => set_password(e.target.value)}
      />
      <button onClick={on_unlock}>Unlock</button>
    </div>
  );
};

export default Unlock;
