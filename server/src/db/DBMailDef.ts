export interface DBMailInfo {
    mailId: string,
    uid: string,
    from: string,
    time: number,
    title: string,
    content: string,
    state: string,
}

export interface DBMail {

    getMail(mailId: string):Promise<DBMailInfo>;

    getMailMany(mailIds: string[] | undefined):Promise<DBMailInfo[]>;

    insterNewMail(from: string, to: string, title: string, content: string):Promise<DBMailInfo>;

    deleteMail(mailId: string):Promise<boolean>;

    deleteMailMany(mailIds: string[]):Promise<boolean>;

    markAsRead(mailId: string):Promise<boolean>;

    markAsReadMany(mailIds: string[] | undefined):Promise<boolean>;
}