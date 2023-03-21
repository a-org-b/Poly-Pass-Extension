export type TKeyStorage = {
    privKey: string
}
export const PRIV_STORAGE_KEY = "privKey"
export const PARAMS_UPDATED="PARAMS_UPDATED"
export const LOGIN_SUCCESS="LOGIN_SUCCESS"
export type CurrentParams = {
    website:string,
    username:string,
    password:string
}

export type Message<T> = {
    key:string;
    body?:T;
}