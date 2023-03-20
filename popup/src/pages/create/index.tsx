import React, { useState } from "react";
import { create_wallet } from "../../wallet/wallet";

const Create = () => {
  const [password, set_password] = useState("");
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
