import { ethers, Wallet } from "ethers";
import {
  ERR_WALLET_NOT_FOUND,
  WALLET_ENCRYPTED_KEY,
  WALLET_PRIV_KEY,
} from "../types";

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
