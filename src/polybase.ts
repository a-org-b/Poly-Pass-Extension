import { Data, WALLET_PRIV_KEY } from "./types";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import {
  aescbc,
  decodeFromString,
  encodeToString,
  EncryptedDataAesCbc256,
} from "@polybase/util";

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import { ethers, Wallet } from "ethers";
let wallet: Wallet | undefined;
chrome.storage.session.get(WALLET_PRIV_KEY).then((e) => {
  const privKey = e[WALLET_PRIV_KEY];
  if (!privKey) {
    chrome.tabs.create({ url: "index.html" });
  }
  wallet = new Wallet(privKey.newValue);
});
chrome.storage.session.onChanged.addListener((e) => {
  const privKey = e[WALLET_PRIV_KEY];
  if (!privKey) {
    chrome.tabs.create({ url: "index.html" });
  }
  wallet = new Wallet(privKey.newValue);
});

const setDb = (): Polybase => {
  if (!wallet) {
    throw new Error("Wallet not unlocked");
  }
  const db = new Polybase({
    defaultNamespace:
      "pk/0x76c342f1696f2e368454ed296df1ead894232b009084f6cb71670881506e0ee6e3fa1b3ea51a3010afa63cb41559eeab504a706138942d597dfd39d856955d45/polyPass",
    signer: (data) => {
      return {
        h: "eth-personal-sign",
        sig: ethPersonalSign(wallet?.privateKey ?? "", data),
      };
    },
  });
  //const collectionReference = db.collection<Data>("passwords");
  return db;
};

export async function EncryptString(
  str: string,
  key: Uint8Array
): Promise<EncryptedDataAesCbc256> {
  // Convert string value to Uint8Array so it can be encrypted
  const strDataToBeEncrypted = decodeFromString(str, "utf8");

  // Encrypt the data, as EncryptedDataAesCbc256
  const encryptedData = await aescbc.symmetricEncrypt(
    key,
    strDataToBeEncrypted
  );

  // Store this data for later access
  return {
    version: encryptedData.version, // aes-cbc-256/symmetric
    nonce: encryptedData.nonce, // Uint8array
    ciphertext: encryptedData.ciphertext, // Uint8array
  };
}

export async function DecryptString(
  key: Uint8Array,
  encryptedData: EncryptedDataAesCbc256
): Promise<string> {
  // Encrypt the data (as EncryptedDataAesCbc256)
  const strData = await aescbc.symmetricDecrypt(key, encryptedData);

  // Convert back from Uint8Array to string
  const str = encodeToString(strData, "utf8");

  return str;
}

const genPass = async (password: string): Promise<string> => {
  // const key = aescbc.generateSecretKey();
  if (!wallet) {
    throw new Error("Wallet not unlocked");
    return "";
  }
  const hardKey = decodeFromString(wallet.privateKey, "hex");
  var encryptstr = await EncryptString(password, hardKey);
  const cipher_str = encodeToString(encryptstr.ciphertext, "base64");
  const nonce_str = encodeToString(encryptstr.nonce, "base64");

  var pass: string = cipher_str + " " + nonce_str;
  return pass;
};

export const createRecord = async (
  username: string,
  password: string,
  url: string
) => {
  var db = setDb();
  const collectionReference = db.collection<Data>("passwords");

  var firstPart: any = (Math.random() * 46656) | 0;
  var secondPart: any = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  var uuid = firstPart + secondPart;

  var encryptedPass = await genPass(password);
  //push data
  const recordData = await collectionReference.create([
    uuid,
    url,
    username,
    encryptedPass,
  ]);
};

export const updatePassword = async (id: string, password: string) => {
  var db = setDb();
  const collectionReference = db.collection<Data>("passwords");

  var encryptedPass = await genPass(password);

  const recordData = await collectionReference
    .record(id)
    .call("updatePassword", [encryptedPass]);
};

export const updateUsername = async (id: string, username: string) => {
  var db = setDb();
  const collectionReference = db.collection<Data>("passwords");

  const recordData = await collectionReference
    .record(id)
    .call("updateUsername", [username]);
};

export const getRecordById = async (id: string) => {
  var db = setDb();
  const collectionReference = db.collection<Data>("passwords");

  const { data, block } = await collectionReference.record(id).get();
  var pass = await decryptMergedPass(data["password"]);
  data["password"] = pass;
};

export const decryptMergedPass = async (
  encryptedPass: string
): Promise<string> => {
  var splitEncryptedPass = encryptedPass.split(" ");
  var encryptedInterface: EncryptedDataAesCbc256 = {
    version: "aes-cbc-256/symmetric",
    nonce: decodeFromString(splitEncryptedPass[1], "base64"),
    ciphertext: decodeFromString(splitEncryptedPass[0], "base64"),
  };
  if (!wallet) {
    throw new Error("Wallet not unlocked");
    return "";
  }
  const hardKey = decodeFromString(wallet.privateKey, "hex");
  var pass: string = await DecryptString(hardKey, encryptedInterface);
  return pass;
};

export const getAllRecords = async () => {
  var db = setDb();
  const collectionReference = db.collection<Data>("passwords");

  const records = await collectionReference.get();
  return records.data;
};
export const getRecordByUrl = async (url: string): Promise<Data[]> => {
  var db = setDb();
  const collectionReference = db.collection<Data>("passwords");
  if (!wallet) {
    throw new Error("Wallet not unlocked");
    return [];
  }

  let publicKey = new ethers.SigningKey(wallet.privateKey).publicKey;
  publicKey = "0x" + publicKey.slice(4);

  let records = await collectionReference
    .where("url", "==", url)
    .where("userId", "==", publicKey)
    .get();
  const new_data = await Promise.all(
    records.data.map(async (e) => {
      return {
        ...e.data,
        password: await decryptMergedPass(e.data.password),
      };
    })
  );

  return new_data;
};
