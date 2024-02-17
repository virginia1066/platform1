import { CompanyToken, TgUser, UserFromWebhook, UserToken } from '../../types/general';
import { Pack, PackLink, Word } from '../../types/Wokobular';


declare module 'knex/types/tables' {
    interface Tables {
        users_from_webhook: UserFromWebhook;

        company_access_tokens: CompanyToken<string>;

        tg_users: TgUser;

        packs: Pack;

        pack_links: PackLink;

        words: Word;
    }

}