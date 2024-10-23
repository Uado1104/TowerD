export interface ReqGetNotice {
    token?:string;
}

export interface ResGetNotice {
    noticeList: { title: string, content: string, contentType: string }[],
}
