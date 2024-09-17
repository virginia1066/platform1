import { User } from 'node-telegram-bot-api';
import { get_student_by_tg } from '../../utils/get_student_by_tg';
import {
    get_student_subscriptions,
    get_subscriptions_groups,
    MkPeriod,
    MkPeriodExt,
    MkSubscriptionStatus
} from '../../utils/request_mk';
import { get_subscription_type_hash } from '../../utils/get_subscription_type_hash';
import { getFixedT, t } from 'i18next';
import { TG_MK_ADMIN_USER } from '../../constants';
import { always, isNotNil, pipe } from 'ramda';
import { MessageSpliter } from '../../services/MessageSpliter';
import { error } from '../../utils/log';
import { format_mk_date } from '../../utils/format_mk_date';

const DOUBLES = [2052, 2054];

export const get_subscriptions = (user: User) =>
    Promise
        .all([
            get_student_by_tg(user.id, true)
                .then((userId) => get_student_subscriptions({
                    userId, statusId: [
                        MkSubscriptionStatus.Disabled,
                        MkSubscriptionStatus.Active,
                        MkSubscriptionStatus.Frozen
                    ]
                })),
            get_subscriptions_groups()
        ])
        .then(([data, groups]) => {
            const hash = get_subscription_type_hash(groups);
            const t = getFixedT('ru', undefined, 'telegram.actions.subscription' as const);

            if (!data.subscriptions.length) {
                return t('empty', { admin: TG_MK_ADMIN_USER });
            }

            const parse_period = (period: MkPeriod) => {
                const [count, ext] = period.split(' ') as [`${number}`, MkPeriodExt];

                return t(`period.${ext}`, { count: Number(count) });
            };

            const tpl_list = data.subscriptions.map(({
                                                         period,
                                                         visitCount,
                                                         visitedCount,
                                                         statusId,
                                                         beginDate,
                                                         endDate,
                                                         subscriptionId
                                                     }, index) => {
                const period_str = period
                    ? parse_period(period)
                    : t('unlimited');

                const total_visit_count = DOUBLES.includes(hash[subscriptionId].id)
                    ? visitCount / 2
                    : visitCount;

                const visited = DOUBLES.includes(hash[subscriptionId].id)
                    ? visitedCount / 2
                    : visitedCount;

                return [
                    t('item', {
                        index: index + 1,
                        period: period_str,
                        visitCount: t('visitCount', { count: total_visit_count })
                    }),
                    t('type', {
                        type: hash[subscriptionId].name
                    }),
                    visitCount === 0 ? null : t('visits', {
                        count: total_visit_count - visited
                    }),
                    period === null ? null : t('interval.title', {
                        interval: statusId === MkSubscriptionStatus.Disabled
                            ? t('interval.disabled')
                            : period === null
                                ? t('unlimited')
                                : t('interval.details', {
                                    beginDate: format_mk_date(beginDate!),
                                    endDate: format_mk_date(endDate!),
                                }),
                        interpolation: {
                            escapeValue: false
                        }
                    }),
                    t('status.title', { status: t(`status.${statusId}`) })
                ].filter(isNotNil).join('\n');
            });

            return new MessageSpliter([
                t('header', { count: data.subscriptions.length }),
                ...tpl_list
            ], '\n\n');
        })
        .catch(pipe(error, always(t('telegram.error'))));

