import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecordById } from "../../../wallet/wallet";
const PassDetails = () => {
  let { id }: any = useParams();
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

  return <div>{Data.id}</div>;
};

export default PassDetails;
