export type UserFromWebhook = {
    class_id: number;
    link_param: string;
    attribute_status: WebhookUserStatus;
}

export enum WebhookUserStatus {
    Done = 'DONE',
    Pending = 'PENDING'
}
