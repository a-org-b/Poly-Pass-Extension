import React, { MouseEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteRecord, getRecordById } from "../../../wallet/wallet";

const PassDetails = () => {
  let { id }: any = useParams();

  const delRecord = (id: string): any => {
    deleteRecord(id);
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
      var resRecord: record = {
        id: response["id"],
        password: response["password"],
        url: response["url"],
        username: response["username"],
      };
      setData(resRecord);
    };
    fetchData();
  }, []);

  return (
    <div className="flex">
      <div>{Data.id}</div>
      <button onClick={() => delRecord(id)}>del</button>
    </div>
  );
};

export default PassDetails;
