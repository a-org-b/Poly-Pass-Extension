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
      <div className="py-5">
        <h1 className="text-2xl font-bold ml-4">PolyPass</h1>

        <hr className="border-gray-300 mx-3 mt-5" />
      </div>
      {AllData.map((item) => (
        <div className="flex justify-around pb-5" key={item.data["id"]}>
          <div>
            <div className="inline-block ml-4">
              <p className="text-lg inline-block font-medium w-28 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.data["url"]}
              </p>{" "}
              <br />
              <p className="text-gray-700 inline-block w-28 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.data["username"]}
              </p>
            </div>
          </div>

          <button
            className="fill-btn"
            onClick={() => navigateDetails(item.data["id"])}
          >
            <span className="fill-btn-txt">Fill </span>
          </button>
        </div>
      ))}
    </>
  );
};

export default MyPasswords;
