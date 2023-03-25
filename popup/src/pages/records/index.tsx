import React from "react";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import {
  aescbc,
  decodeFromString,
  encodeToString,
  EncryptedDataAesCbc256,
} from "@polybase/util";
import { createRecord } from "../../wallet/wallet";
const Records = () => {
  const handleSubmit: any = (e: SubmitEvent) => {
    e.preventDefault();
  };
  const handleSubmit2: any = (e: SubmitEvent) => {
    e.preventDefault();
    createRecord("punu", "punu123@", "goolag.com");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input
          className="cursor-pointer border-2 p-1"
          type="submit"
          value="submit"
        />
      </form>
      <form onSubmit={handleSubmit2}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input
          className="cursor-pointer border-2 p-1"
          type="submit"
          value="send"
        />
      </form>
    </div>
  );
};

export default Records;
