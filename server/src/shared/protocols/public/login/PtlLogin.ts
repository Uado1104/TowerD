export interface ReqLogin {
    account: string,
    password: string,
}

export interface ResLogin {
    token: string,
    uid: string,
    time: number,
    sign:string,
    lobbyUrl:string,
}