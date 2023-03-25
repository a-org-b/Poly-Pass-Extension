import React, { MouseEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  decryptMergedPass,
  deleteRecord,
  getRecordById,
  updatePassword,
  updateUsername,
} from "../../../wallet/wallet";

const PassDetails = () => {
  let { id }: any = useParams();

  const delRecord = (id: string): any => {
    deleteRecord(id);
  };

  const editUsername = () => {
    updateUsername(Data.id, Data.username);
  };

  const editPassword = () => {
    updatePassword(Data.id, Data.password);
  };
  const [PassBoxValue, setPassBoxValue] = useState("*******");
  const showPassword = () => {
    setPassBoxValue(Data.password);
  };
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

  return (
    <div className="p-5">
      <div className="text-3xl font-semibold pb-5">{Data.url}</div>
      <div className="flex-row mb-5">
        <input
          className="w-40 py-1 px-3 mr-1 rounded-lg"
          type="text"
          name=""
          id="usernameBox"
          value={Data.username}
          onChange={(e) => setData({ ...Data, username: e.target.value })}
        />
        <button
          className="ml-2 rounded-lg py-1 px-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
          id="editUsername"
          onClick={(e) => editUsername()}
        >
          edit
        </button>
      </div>
      <div className="flex-row mb-5">
        <input
          className="w-40 py-1 px-3 mr-1 rounded-lg"
          type="text"
          name=""
          id="passwordBox"
          value={PassBoxValue}
        />
        <button
          className="ml-2 rounded-lg py-1 px-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
          id="showPassword"
          onClick={() => showPassword()}
        >
          show
        </button>
      </div>

      <button
        id="delete"
        className="rounded-lg py-1 px-4 border-2 border-red-500 text-red-500 hover:bg-red-600 hover:text-red-100 duration-300"
        onClick={() => delRecord(id)}
      >
        del
      </button>
    </div>
  );
};

export default PassDetails;
