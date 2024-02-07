import { UserFromWebhook } from '../../types/general';


declare module 'knex/types/tables' {
    interface Tables {
        users_from_webhook: UserFromWebhook;
    }

}