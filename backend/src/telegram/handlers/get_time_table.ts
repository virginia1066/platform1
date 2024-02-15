import { User } from 'node-telegram-bot-api';
import { get_student_by_tg } from '../../utils/get_student_by_tg';
import { get_dictionaries } from '../../utils/get_dictionaries';
import { get_manager, get_user_lessons } from '../../utils/request_mk';
import { MessageSpliter } from '../../services/MessageSpliter';
import { getFixedT, t } from 'i18next';
import { always, indexBy, pipe, prop, propEq } from 'ramda';
import dayjs from 'dayjs';
import { error } from '../../utils/log';

export const get_time_table =
    (user: User) =>
        Promise
            .all([
                get_student_by_tg(user.id, true)
                    .then(get_user_lessons)
                    .then(prop('lessons')),
                get_dictionaries()
            ])
            .then(([lessons, [filials, courses, classes]]) => {
                const t = getFixedT('ru', undefined, 'telegram.actions.timetable');
                const tDict = getFixedT('ru', undefined, 'telegram.dictionary');

                if (!lessons.length) {
                    return new MessageSpliter([t('empty')], '');
                }

                const hash_filials = indexBy(prop('id'), filials);
                const hash_courses = indexBy(prop('id'), courses);
                const hash_classes = indexBy(prop('id'), classes);

                const course_type_map = {
                    course: tDict('course'),
                    master: tDict('master'),
                    personal: tDict('personal')
                };

                const filial_map: Partial<Record<number, string>> = {
                    30082: '🏠',
                    30125: '🌐'
                };

                const first_day = lessons[0].date;
                const first_day_lessons = lessons.filter(propEq(first_day, 'date'));

                const get_base_info = (lesson: typeof lessons[number]) => {
                    const date = dayjs(lesson.date);
                    const lesson_class = hash_classes[lesson.classId];
                    const course = hash_courses[lesson_class.courseId];
                    const month_num = date.get('month') as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
                    const month = tDict(`month.${month_num}`);

                    return {
                        date: date.format('D'),
                        month,
                        week_day: date.format('dddd'),
                        time_interval: `${lesson.beginTime}-${lesson.endTime}`,
                        course_type: course_type_map[course.courseType],
                        filial: hash_filials[lesson.filialId].name.toLowerCase(),
                        icon: filial_map[lesson.filialId] ?? '',
                        lesson_class: hash_classes[lesson.classId],
                        address: hash_filials[lesson.filialId].address
                    };
                };

                return Promise
                    .all(first_day_lessons.map((lesson) => {
                        const lesson_class = hash_classes[lesson.classId];
                        return get_manager(lesson_class.managerIds[0]);
                    }))
                    .then<MessageSpliter>((managers) => {
                        const managers_hash = indexBy(prop('id'), managers);

                        const tpl = lessons.map((lesson) => {
                            return t('short', get_base_info(lesson));
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
                            } = get_base_info(lesson);

                            return t('detailed', {
                                date, week_day, month,
                                icon, course_type, filial, time_interval, address,
                                link: `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`,
                                manager: managers_hash[lesson_class.managerIds[0]].name
                            });
                        });

                        return new MessageSpliter([
                            t('header', { count: lessons.length }),
                            ...tpl,
                            new MessageSpliter(detailed_tpl, '\n\n')
                        ], '\n\n');
                    });
            })
            .catch(pipe(error, always(t('telegram.error'))));