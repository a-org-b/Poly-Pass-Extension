import React, {
  ButtonHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";
import { getAllRecords } from "../../wallet/wallet";
import { CollectionRecordResponse } from "@polybase/client";

const MyPasswords = () => {
  const [AllData, setAllData] = useState<CollectionRecordResponse<any>[]>([]);
  const navigateDetails = (e: React.MouseEvent<HTMLElement>) => {
    let id = "ok";
    navigate(`/my-passwords/${id}`);
  };
  const navigate = useNavigate();
  const wallet_context = useContext(WalletContext);

  const check = async () => {
    if (!(await wallet_context.get_wallet())) navigate("/unlock");
  };
  useEffect(() => {
    check();
    const fetchAllData = async () => {
      const response = await getAllRecords();
      setAllData(response);
    };
    fetchAllData();
  }, [wallet_context]);

  return (
    <>
      <div className="py-5">
        <h1 className="text-2xl font-bold ml-4">PolyPass</h1>

        <hr className="border-gray-300 mx-3" />
      </div>
      {AllData.map((item) => (
        <div className="flex justify-around py-5" key={item.data["id"]}>
          <div>
            <img
              src="https://pbs.twimg.com/profile_images/1636460024443596800/BgJKFm1i_400x400.jpg"
              alt="logo"
              className="inline-block h-10 -mt-7 rounded-full"
            ></img>
            <div className="inline-block ml-4">
              <span className="text-lg font-medium">{item.data["url"]}</span>{" "}
              <br />
              <span className="text-gray-700">{item.data["username"]}</span>
            </div>
          </div>

          <button
            className="bg-[#496BE1] text-white w-16 font-medium rounded-3xl"
            onClick={navigateDetails}
          >
            Fill
          </button>
        </div>
      ))}
    </>
  );
};

export default MyPasswords;
