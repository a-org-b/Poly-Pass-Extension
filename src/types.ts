export const WALLET_ENCRYPTED_KEY = "WALLET_ENCRYPTED";
export const WALLET_PRIV_KEY = "WALLET_PRIV_KEY";
export const ERR_WALLET_NOT_FOUND = new Error("Wallet not found");
export interface Data {
  id: string;
  password: string;
  publicKey: PublicKey;
  url: string;
  username: string;
}

export interface PublicKey {
  alg: string;
  crv: string;
  kty: string;
  use: string;
  x: string;
  y: string;
}
export type Password = {
  website: string;
  username: string;
  password: string;
};

export type TKeyStorage = {
  privKey: string;
};
export const PRIV_STORAGE_KEY = "privKey";

export enum MessageKey {
  PARAMS_UPDATED,
  LOGIN_SUCCESS,
  GET_PASSWORDS,
  SAVE_PASSWORD,
}

export type CurrentParams = {
  website: string;
  username: string;
  password: string;
};

export type GetPasswords = {
  domain: string;
};

export type GetPasswordRes = Password[];

export type Message<T> = {
  key: MessageKey;
  body?: T;
};
