import { HomeTaskWebhook, UserFromWebhook } from './general';

export type MessageBussEvents = {
    user_create: UserFromWebhook;
    home_task_update: HomeTaskWebhook;
}