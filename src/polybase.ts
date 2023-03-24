import { Password, WALLET_PRIV_KEY } from "./types";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import {
  aescbc,
  decodeFromString,
  encodeToString,
  EncryptedDataAesCbc256,
} from "@polybase/util";

let priv_key: string | undefined = undefined;
chrome.storage.session.onChanged.addListener((e) => {
  if (e[WALLET_PRIV_KEY]) {
    priv_key = e[WALLET_PRIV_KEY].newValue;
  }
});
export const get_passwords = (): Password[] => {
  return [
    {
      password: "1234",
      username: "thisisommore",
      website: "www.ommore.me",
    },
    {
      password: "study karo",
      username: "thisisommore",
      website: "github.com",
    },
    {
      password: "1234",
      username: "thisisommoremax",
      website: "github.com",
    },
  ];
};

const hardKey = decodeFromString(
  "95tUuJPAkFV5r60rV12uEYoFErTIEXG7am6tMWzcvcU=",
  "base64"
); //95tUuJPAkFV5r60rV12uEYoFErTIEXG7am6tMWzcvcU=
const setDb = (): Polybase => {
  const db = new Polybase({
    defaultNamespace:
      "pk/0x76c342f1696f2e368454ed296df1ead894232b009084f6cb71670881506e0ee6e3fa1b3ea51a3010afa63cb41559eeab504a706138942d597dfd39d856955d45/polyPass",
    signer: (data) => {
      return {
        h: "eth-personal-sign",
        sig: ethPersonalSign(
          "0x79d1fcf6d9334cedc837ee3f9d2c54b7294aa702ed07f6f77f8a49235a9f9114",
          data
        ),
      };
    },
  });
  //const collectionReference = db.collection("passwords");
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
  const collectionReference = db.collection("passwords");

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
  const collectionReference = db.collection("passwords");

  var encryptedPass = await genPass(password);

  const recordData = await collectionReference
    .record(id)
    .call("updatePassword", [encryptedPass]);
};

export const updateUsername = async (id: string, username: string) => {
  var db = setDb();
  const collectionReference = db.collection("passwords");

  const recordData = await collectionReference
    .record(id)
    .call("updateUsername", [username]);
};

export const getRecordById = async (id: string) => {
  var db = setDb();
  const collectionReference = db.collection("passwords");

  const { data, block } = await collectionReference.record(id).get();
  var pass = await decryptMergedPass(data["password"])
  console.log(pass)
  data["password"] = pass
};

export const decryptMergedPass = async (encryptedPass : string) : Promise<string> => {
  var splitEncryptedPass = encryptedPass.split(" ");
  var encryptedInterface: EncryptedDataAesCbc256 = {
    version: "aes-cbc-256/symmetric",
    nonce: decodeFromString(splitEncryptedPass[1], "base64"),
    ciphertext: decodeFromString(splitEncryptedPass[0], "base64"),
  };
  var pass: string = await DecryptString(hardKey, encryptedInterface);
  return pass
}

export const getAllRecords = async () => {
  var db = setDb();
  const collectionReference = db.collection("passwords");

  const records = await collectionReference.get();
  return records.data
};
export const getRecordByUrl = async (url: string) => {
  var db = setDb();
  const collectionReference = db.collection("passwords");

  const records = await collectionReference.where("url", "==", url).get();
  console.log(records);
};