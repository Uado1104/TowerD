export interface ReqModifyUserInfo {
    token?:string;
    gender?:number,
    introduction?:string,
}

export interface ResModifyUserInfo {
    gender?:number,
    introduction?:string,
}
