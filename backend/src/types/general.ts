import { Dayjs } from 'dayjs';

export type UserFromWebhook = {
    class_id: number;
    link_param: string;
    attribute_status: WebhookUserStatus;
}

export enum WebhookUserStatus {
    Done = 'DONE',
    Pending = 'PENDING'
}

export type CompanyToken<Date = Dayjs> = {
    token: string;
    expiredAt: Date;
}

export type UserToken<Date = Dayjs> = {
    token: string;
    expiredAt: Date;
    student_id: number;
}

export type TgUser = {
    tg_id: number;
    mk_id: number;
}
