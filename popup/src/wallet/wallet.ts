import { ethers, Wallet } from "ethers";

export const WALLET_ENCRYPTED_KEY = "WALLET_ENCRYPTED"

export const wallet_exist = () => {
    const encrypted_json = localStorage.getItem(WALLET_ENCRYPTED_KEY)
    return encrypted_json != null
}

export const get_wallet_from_local = async (password: string): Promise<Wallet> => {
    const encrypted_json = localStorage.getItem(WALLET_ENCRYPTED_KEY)
    if (!encrypted_json) throw new Error("Wallet not found")
    const wallet = await ethers.Wallet.fromEncryptedJson(encrypted_json, password)
    return wallet as Wallet
}

export const create_wallet = async (password: string) => {
    const wallet = ethers.Wallet.createRandom()
    const encrypt_res = await wallet.encrypt(password)
    localStorage.setItem(WALLET_ENCRYPTED_KEY, encrypt_res)
}