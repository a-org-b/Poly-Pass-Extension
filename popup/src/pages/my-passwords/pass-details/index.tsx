import React, { MouseEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePolyBase } from "../../../hooks/usePolyBase";
import { useNavigate } from "react-router-dom";

const PassDetails = () => {
  let { id }: any = useParams();
  const navigate = useNavigate();

  const {
    getRecordById,
    decryptMergedPass,
    deleteRecord,
    updatePassword,
    updateUsername,
  } = usePolyBase();
  interface record {
    id: string;
    password: string;
    url: string;
    username: string;
  }
  const [Data, setData] = useState<record>({
    id: "",
    password: "",
    url: "",
    username: "",
  });
  useEffect(() => {
    getRecordById(id);
    const fetchData = async () => {
      const response = await getRecordById(id);
      let decryptedPass = await decryptMergedPass(response["password"]);
      var resRecord: record = {
        id: response["id"],
        password: decryptedPass,
        url: response["url"],
        username: response["username"],
      };
      setData(resRecord);
    };
    fetchData();
  }, []);

  const [PassHidden, setPassHidden] = useState<boolean>(true);
  const delRecord = (id: string): any => {
    deleteRecord(id);
    navigate("/my-passwords");
  };

  const editAll = () => {
    updatePassword(Data.id, Data.password);
    updateUsername(Data.id, Data.username);
  };
  const showPassword = () => {
    setPassHidden(false);
  };

  return (
    <div>
      <div className="top flex flex-row bg-gray-200 align-middle mb-1 px-2 py-2">
        <button
          onClick={() => navigate("/my-passwords")}
          className="back bg-blue-300 text-blue-700 mr-2 p-1 w-8 h-8 align-middle justify-center flex rounded-full font-semibold"
        >
          {" < "}
        </button>
        <div className="text-xl font-bold ">Details</div>
      </div>
      <div className="flex-row flex justify-between">
        <div className="text-xl font-bold align-middle ml-3 my-3">
          {Data.url}
        </div>
        <button
          id="delete"
          className="rounded-lg py-1 px-4 border-2 border-red-500 text-red-500 hover:bg-red-600 hover:text-red-100 duration-300 m-2"
          onClick={() => delRecord(id)}
        >
          Delete
        </button>
      </div>
      <div className="flex-row mb-3">
        <div className="pb-1 px-4 text-sm text-slate-600">Username</div>
        <input
          style={{ width: "-webkit-fill-available" }}
          className="py-1 px-3 mx-2 rounded-lg bg-blue-100"
          type="text"
          name=""
          id="usernameBox"
          value={Data.username}
          onChange={(e) => setData({ ...Data, username: e.target.value })}
        />
        {/* <button
          className="ml-2 rounded-lg py-1 px-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
          id="editUsername"
          onClick={(e) => editUsername()}
        >
          update
        </button> */}
      </div>
      <div className="flex-row mb-5">
        <div className="pb-1 px-4 text-slate-600 text-sm">Password</div>
        <input
          style={{ width: "-webkit-fill-available" }}
          className="py-1 px-3 mx-2 rounded-lg bg-blue-100 align-middle"
          type="text"
          name=""
          id="passwordBox"
          value={PassHidden ? "********" : Data.password}
          onChange={
            PassHidden
              ? undefined
              : (e) => setData({ ...Data, password: e.target.value })
          }
        />
      </div>
      <div className="flex flex-row mb-2">
        <button
          className="ml-2 mr-2 rounded-lg py-1 px-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
          id="showPassword"
          onClick={() => showPassword()}
        >
          show
        </button>
        <button
          className="ml-2 rounded-lg py-1 px-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
          id="showPassword"
          onClick={() => editAll()}
        >
          update
        </button>
      </div>
    </div>
  );
};

export default PassDetails;
