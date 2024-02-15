import bot, { Buttons, ConfigType, ResponseItem } from './library';
import { getFixedT, t } from 'i18next';
import { knex, TG, TG_MK_ADMIN_USER } from '../constants';
import { info, warn } from '../utils/log';
import { BaseItem } from './library/types';
import { always, flatten, head, isNotNil, propEq } from 'ramda';
import { UserFromWebhook } from '../types/general';
import {
    get_student,
    get_student_subscriptions,
    get_subscriptions_groups,
    GetStudentResponse,
    MkPeriod,
    MkPeriodExt,
    MkSubscriptionStatus
} from '../utils/request_mk';
import { get_student_by_tg } from '../utils/get_student_by_tg';
import dayjs from 'dayjs';
import { MessageSpliter } from '../services/MessageSpliter';
import { get_subscription_type_hash } from '../utils/get_subscription_type_hash';
import { get_time_table } from './handlers/get_time_table';
import { get_subscriptions } from './handlers/get_subscriptions';
import { get_start_message } from './handlers/get_start_message';
import { get_payments } from './handlers/get_payments';

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
                text: t('telegram.unknown_message')
            },
            {
                id: 'start-error',
                type: ConfigType.Text,
                text: t('telegram.start.fail', { admin_user: TG_MK_ADMIN_USER })
            },
            {
                id: 'timetable',
                type: ConfigType.Text,
                text: get_time_table,
                buttons
            },
            {
                id: 'subscription',
                type: ConfigType.Text,
                text: get_subscriptions,
                buttons
            },
            {
                id: 'payments',
                type: ConfigType.Text,
                text: get_payments,
                buttons
            },
            {
                id: 'start',
                type: ConfigType.Command,
                action: get_start_message(buttons),
                showInMenu: false,
                description: ''
            }
        ]
    });
};
