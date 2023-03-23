import { ethers, Wallet } from "ethers";
import {
  ERR_WALLET_NOT_FOUND,
  WALLET_ENCRYPTED_KEY,
  WALLET_PRIV_KEY,
} from "../types";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import {
  aescbc,
  decodeFromString,
  encodeToString,
  EncryptedDataAesCbc256,
} from "@polybase/util";

export const wallet_exist = () => {
  const encrypted_json = localStorage.getItem(WALLET_ENCRYPTED_KEY);
  return encrypted_json != null;
};

export const get_wallet_from_session = async (): Promise<Wallet> => {
  if (chrome?.storage) {
    const priv_key = await chrome.storage.session.get(WALLET_PRIV_KEY);
    if (!priv_key) throw ERR_WALLET_NOT_FOUND;
    return new Wallet(priv_key[WALLET_PRIV_KEY]);
  } else {
    const priv_key = sessionStorage.getItem(WALLET_PRIV_KEY);
    if (!priv_key) throw ERR_WALLET_NOT_FOUND;
    return new Wallet(priv_key);
  }
};

export const clear_session_wallet = async () => {
  if (chrome?.storage) {
    await chrome.storage.session.remove(WALLET_PRIV_KEY);
  } else {
    sessionStorage.removeItem(WALLET_PRIV_KEY);
  }
};

export const set_wallet_to_session = async (w: Wallet): Promise<void> => {
  if (chrome?.storage) {
    await chrome.storage.session.set({ WALLET_PRIV_KEY: w.privateKey });
  } else {
    sessionStorage.setItem(WALLET_PRIV_KEY, w.privateKey);
  }
};

export const get_wallet_from_local = async (
  password: string
): Promise<Wallet> => {
  const encrypted_json = localStorage.getItem(WALLET_ENCRYPTED_KEY);
  if (!encrypted_json) throw new Error("Wallet not found");
  const wallet = await ethers.Wallet.fromEncryptedJson(
    encrypted_json,
    password
  );
  return wallet as Wallet;
};

export const create_wallet = async (password: string) => {
  const wallet = ethers.Wallet.createRandom();
  const encrypt_res = await wallet.encrypt(password);
  localStorage.setItem(WALLET_ENCRYPTED_KEY, encrypt_res);
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

const createRecord = async (
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

const updatePassword = async (id: string, password: string) => {
  var db = setDb();
  const collectionReference = db.collection("passwords");

  var encryptedPass = await genPass(password);

  const recordData = await collectionReference
    .record(id)
    .call("updatePassword", [encryptedPass]);
};

const updateUsername = async (id: string, username: string) => {
  var db = setDb();
  const collectionReference = db.collection("passwords");

  const recordData = await collectionReference
    .record(id)
    .call("updateUsername", [username]);
};

const getRecordById = async (id: string) => {
  var db = setDb();
  const collectionReference = db.collection("passwords");

  const { data, block } = await collectionReference.record(id).get();
  var encryptedPass: string = data["password"];
  var splitEncryptedPass = encryptedPass.split(" ");
  var encryptedInterface: EncryptedDataAesCbc256 = {
    version: "aes-cbc-256/symmetric",
    nonce: decodeFromString(splitEncryptedPass[1], "base64"),
    ciphertext: decodeFromString(splitEncryptedPass[0], "base64"),
  };
  var pass: string = await DecryptString(hardKey, encryptedInterface);
  data["password"] = pass
  console.log(pass)
};
