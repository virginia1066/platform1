import { CompanyToken, TgUser, UserFromWebhook, UserToken } from '../../types/general';


declare module 'knex/types/tables' {
    interface Tables {
        users_from_webhook: UserFromWebhook;

        company_access_tokens: CompanyToken<string>;

        user_csrf_tokens: UserToken<string>;

        tg_users: TgUser;
    }

}