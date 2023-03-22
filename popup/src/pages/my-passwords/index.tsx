import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";

const MyPasswords = () => {
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);

  const check = async () => {
    if (!(await wallet_context.get_wallet())) navigate("/unlock");
  };
  useEffect(() => {
    check();
  }, [wallet_context]);
  return (
    <div className="py-5">
      <h1 className="text-2xl font-bold ml-4">PolyPass</h1>

      <div className="flex justify-around py-5">
        <div>
          <img
            src="https://pbs.twimg.com/profile_images/1636460024443596800/BgJKFm1i_400x400.jpg"
            alt="logo"
            className="inline-block h-10 -mt-7 rounded-full"
          ></img>
          <div className="inline-block ml-4">
            <span className="text-lg font-medium">facebook.com</span> <br />
            <span className="text-gray-700">thisisommore</span>
          </div>
        </div>

        <button className="bg-[#496BE1] text-white w-16 font-medium rounded-3xl">
          Fill
        </button>
      </div>
      <hr className="border-gray-300 mx-3" />
    </div>
  );
};

export default MyPasswords;
