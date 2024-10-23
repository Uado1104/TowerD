export interface ReqGetMails {
    token?:string;
}

export interface ResGetMails {
    mails: {
        mailId: string,
        uid: string,
        from: string,
        time: number,
        title: string,
        content: string,
        state: string,
    }[];
}
