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
    Pending = 'PENDING'
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
    Done = 'DONE'
}

export type SubscriptionEndNotify = {
    subscription_id: number;
    student_id: number;
    end_date: string;
    notify_status: SubscriptionEndStatus
}
