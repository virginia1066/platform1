import { UserFromWebhook } from './general';

export type MessageBussEvents = {
    user_create: UserFromWebhook;
}