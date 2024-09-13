import { Dayjs } from 'dayjs';

export type UserFromWebhook<Date = string> = {
    class_id: number;
    link_param: string;
    attribute_status: WebhookUserStatus;
    user_created_at: Date;
}

export enum WebhookHomeTaskStatus {
    Done = 'DONE',
    Pending = 'PENDING'
}

export type HomeTaskWebhook = {
    lesson_id: number;
    status: WebhookHomeTaskStatus;
}

export enum WebhookUserStatus {
    Done = 'DONE',
    Pending = 'PENDING',
    Fail = 'FAIL'
}

export type CompanyToken<Date = Dayjs> = {
    token: string;
    expiredAt: Date;
}

export type TgUser = {
    tg_id: number;
    mk_id: number;
}

export enum SubscriptionEndStatus {
    Pending = 'PENDING',
    Done = 'DONE',
    NoTelegram = 'NO_TELEGRAM'
}

export type SubscriptionEndNotify = {
    subscription_id: number;
    student_id: number;
    end_date: string;
    notify_status: SubscriptionEndStatus;
    created_at: string;
}

export type AdminMessage<Date = string> = {
    message_id: number;
    created_at: Date;
    updated_at: Date;
    status: AdminMessageStatus;
}

export enum AdminMessageStatus {
    Pending = 'PENDING',
    Done = 'DONE'
}
