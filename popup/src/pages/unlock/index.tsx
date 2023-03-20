import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";

const Unlock = () => {
  const [password, set_password] = useState("");
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);

  const on_unlock = () => {
    wallet_context.unlock(password);
    navigate("/wallet");
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
