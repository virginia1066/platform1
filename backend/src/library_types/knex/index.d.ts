import { CompanyToken, HomeTaskWebhook, SubscriptionEndNotify, TgUser, UserFromWebhook } from '../../types/general';
import { LearnCard, LessonUpdate, Pack, PackLink, Word } from '../../types/Wokobular';


declare module 'knex/types/tables' {
    interface Tables {
        users_from_webhook: UserFromWebhook;

        home_task_webhook: HomeTaskWebhook;

        company_access_tokens: CompanyToken<string>;

        tg_users: TgUser;

        packs: Pack;

        pack_links: PackLink;

        words: Word;

        learn_cards: LearnCard;

        lesson_updates: LessonUpdate;

        subscription_notify: SubscriptionEndNotify;
    }

}