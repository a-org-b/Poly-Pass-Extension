import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create_wallet, wallet_exist } from "../../wallet/wallet";
import { Icon } from "@iconify/react";

const Create = () => {
  const [password, set_password] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (wallet_exist()) navigate("/wallet");
  }, []);
  const on_create = async () => {
    await create_wallet(password);
    navigate("/wallet");
  };
  return (
    <div className="h-96 flex">
      <div className="mx-auto w-9/12 m-auto">
        <Icon icon="material-symbols:key" className="text-gray-400 text-4xl " />
        <p className=" mb-2">New Password</p>
        <input
          placeholder="Password"
          type="password"
          className="bg-gray-300 mt-1 rounded-md py-1 px-2 w-full text-black placeholder-black"
          onChange={(e) => set_password(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white mt-2 w-full rounded-md"
          onClick={on_create}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Create;
