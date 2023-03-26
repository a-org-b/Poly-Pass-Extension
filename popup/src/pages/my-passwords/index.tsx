import React, {
  ButtonHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/WalletContext";
import { CollectionRecordResponse } from "@polybase/client";
import { usePolyBase } from "../../hooks/usePolyBase";

const MyPasswords = () => {
  const [AllData, setAllData] = useState<CollectionRecordResponse<any>[]>([]);
  const { get_all_my_records } = usePolyBase();
  const navigateDetails = (id: string) => {
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
      const response = await get_all_my_records();
      setAllData(response);
    };
    fetchAllData();
  }, [wallet_context]);

  return (
    <>
      <div className="py-5 bg-gray-200 mb-4">
        <h1 className="text-2xl font-extrabold ml-4 tracking-wider">
          PolyPass
        </h1>
      </div>
      {AllData.map((item) => (
        <div className="flex justify-around pb-5" key={item.data["id"]}>
          <div>
            <div className="inline-block">
              <p className="text-gray-700 text-lg inline-block font-semibold w-36 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.data["url"]}
              </p>{" "}
              <br />
              <p className="text-gray-700 inline-block w-36 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.data["username"]}
              </p>
            </div>
          </div>

          <button
            className="fill-btn"
            onClick={() => navigateDetails(item.data["id"])}
          >
            <span className="fill-btn-txt tracking-wide">View</span>
          </button>
        </div>
      ))}
    </>
  );
};

export default MyPasswords;
