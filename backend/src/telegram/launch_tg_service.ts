import bot, { Buttons, ConfigType, ResponseItem } from './library';
import { t } from 'i18next';
import { TG, TG_MK_ADMIN_USER } from '../constants';
import { always, flatten, propEq } from 'ramda';
import { get_time_table } from './handlers/get_time_table';
import { get_subscriptions } from './handlers/get_subscriptions';
import { get_start_message } from './handlers/get_start_message';
import { get_payments } from './handlers/get_payments';
import { analytics_action } from './analytics_action';

export const launch_tg_service = () => {
    const buttons: Buttons = [
        [
            {
                text: t('telegram.buttons.timetable'),
                action: () => ({ id: 'timetable' })
            }
        ],
        [
            {
                text: t('telegram.buttons.subscription'),
                action: () => ({ id: 'subscription' })
            },
            {
                text: t('telegram.buttons.payments'),
                action: () => ({ id: 'payments' })
            }
        ]
    ];

    bot(TG, {
        unknownMessage: (user, event) => {
            const text = event.text;

            if (!text) {
                return { id: 'unknown' };
            }

            const button = flatten(buttons).find(propEq(text, 'text') as any);

            if (!button) {
                return { id: 'unknown' };
            }

            return (button.action as () => ResponseItem)();
        },
        parseMode: 'HTML',
        actions: [
            {
                id: 'unknown',
                type: ConfigType.Text,
                text: t('telegram.unknown_message', {admin: TG_MK_ADMIN_USER})
            },
            {
                id: 'start-error',
                type: ConfigType.Text,
                text: analytics_action(
                    { event_type: 'Telegram Auth Fail' },
                    always(t('telegram.start.fail', { admin: TG_MK_ADMIN_USER }))
                ),
            },
            {
                id: 'timetable',
                type: ConfigType.Text,
                text: analytics_action({ event_type: 'Telegram Get Timetable Click' }, get_time_table),
                buttons
            },
            {
                id: 'subscription',
                type: ConfigType.Text,
                text: analytics_action({ event_type: 'Telegram Get Subscriptions Click' }, get_subscriptions),
                buttons
            },
            {
                id: 'payments',
                type: ConfigType.Text,
                text: analytics_action({ event_type: 'Telegram Get Payments Click' }, get_payments),
                buttons
            },
            {
                id: 'start',
                type: ConfigType.Command,
                action: analytics_action({ event_type: 'Telegram Start Chat Click' }, get_start_message(buttons)),
                showInMenu: false,
                description: ''
            }
        ]
    });
};
