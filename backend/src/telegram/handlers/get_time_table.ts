import { User } from 'node-telegram-bot-api';
import { get_student_by_tg } from '../../utils/get_student_by_tg';
import { get_manager } from '../../utils/request_mk';
import { MessageSpliter } from '../../services/MessageSpliter';
import { getFixedT, t } from 'i18next';
import { always, filter, indexBy, isNotNil, not, pipe, prop, propEq } from 'ramda';
import { error } from '../../utils/log';
import { TG_MK_ADMIN_USER } from '../../constants';
import { get_lessons } from './utils/get_lessons';

const get_student = (user: User | number) =>
    typeof user === 'number'
        ? Promise.resolve(user)
        : get_student_by_tg(user.id, true);

export const get_time_table =
    (user: User | number) =>
        get_student(user)
            .then(get_lessons)
            .then(filter(pipe(propEq('b4b', 'filial'), not)))
            .then((lessons) => {
                const t = getFixedT('ru', undefined, 'telegram.actions.timetable');

                if (!lessons.length) {
                    return new MessageSpliter([t('empty', { admin: TG_MK_ADMIN_USER })], '');
                }

                const first_day = lessons[0].origin_date;
                const first_day_lessons = lessons.filter(propEq(first_day, 'origin_date'));

                return Promise
                    .all(first_day_lessons.map((lesson) =>
                        get_manager(lesson.manager_id)
                    ))
                    .then<MessageSpliter>((managers) => {
                        const managers_hash = indexBy(prop('id'), managers);

                        const tpl = lessons.map((lesson) => {
                            return t('short', lesson);
                        });

                        const detailed_tpl = first_day_lessons.map((lesson) => {
                            const {
                                icon,
                                course_type,
                                address,
                                filial,
                                lesson_class,
                                time_interval,
                                date,
                                week_day,
                                month
                            } = lesson;

                            const manager = managers_hash[lesson_class.managerIds[0]].name;

                            return [
                                t('detailed.date', { date, month, week_day }),
                                t('detailed.type', { icon, course_type, filial }),
                                t('detailed.time', { time_interval }),
                                lesson.address
                                    ? t('detailed.place', {
                                        link: `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`,
                                        address
                                    })
                                    : null,
                                lesson.address
                                    ? t('detailed.room', { room: lesson.room })
                                    : null,
                                t('detailed.manager', { manager }),
                                t('time_zone')
                            ].filter(isNotNil).join('\n');
                        });

                        return new MessageSpliter([
                            t('header', { count: lessons.length }),
                            ...tpl,
                            new MessageSpliter(detailed_tpl, '\n\n')
                        ], '\n\n');
                    });
            })
            .catch(pipe(error, always(t('telegram.error'))));