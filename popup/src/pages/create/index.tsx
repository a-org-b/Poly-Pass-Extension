import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create_wallet, wallet_exist } from "../../wallet/wallet";

const Create = () => {
  const [password, set_password] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (wallet_exist()) navigate("/wallet");
  }, []);
  const on_create = () => {
    create_wallet(password);
  };
  return (
    <div>
      <label htmlFor="">New Password</label>
      <br />
      <input
        placeholder="Password"
        type="password"
        className="bg-black"
        onChange={(e) => set_password(e.target.value)}
      />
      <button onClick={on_create}>Create</button>
    </div>
  );
};

export default Create;
