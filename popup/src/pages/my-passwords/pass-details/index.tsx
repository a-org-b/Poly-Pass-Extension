import React from "react";
import { useParams } from "react-router-dom";
const PassDetails = () => {
  let { id } = useParams();

  return <div>{id}</div>;
};

export default PassDetails;
