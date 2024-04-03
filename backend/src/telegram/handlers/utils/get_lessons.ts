import { ClassesResponse, CurseResponse, get_user_lessons } from '../../../utils/request_mk';
import { indexBy, prop } from 'ramda';
import { get_dictionaries } from '../../../utils/get_dictionaries';
import { getFixedT } from 'i18next';
import dayjs from 'dayjs';
import { info } from '../../../utils/log';

export const get_lessons = (student_id: number) =>
    Promise
        .all([
            get_user_lessons(student_id)
                .then(prop('lessons')),
            get_dictionaries()
        ])
        .then(([lessons, [filials, courses, classes, rooms]]) => {
            const tDict = getFixedT('ru', undefined, 'telegram.dictionary');

            const address_map: Record<number, string> = {
                44727: `г. Москва, ул. Большая Новодмитровская, 36`,
                45259: `г. Москва, ул. Большая Новодмитровская, 36`,
                45258: `г. Москва, ул. Большая Новодмитровская, 23c6`,
                44728: `г. Москва, ул. Большая Новодмитровская, 23c6`,
                44730: `г. Москва, ул. Большая Новодмитровская, 23c6`,
                44731: `г. Москва, ул. Большая Новодмитровская, 23c6`,
                44732: `г. Москва, ул. Большая Новодмитровская, 23c6`,
                44733: `г. Москва, ул. Большая Новодмитровская, 23c6`,
                44734: `г. Москва, ул. Большая Новодмитровская, 23c6`,
                44735: `г. Москва, ул. Большая Новодмитровская, 23c6`,
            };

            const course_type_map = {
                course: tDict('course'),
                master: tDict('master'),
                personal: tDict('personal')
            };

            const filial_map: Partial<Record<number, string>> = {
                30082: '🏠',
                30125: '🌐',
                30468: '💼',
                30424: '🥸'
            };

            const hash_filials = indexBy(prop('id'), filials);
            const hash_courses = indexBy(prop('id'), courses);
            const hash_classes = indexBy(prop('id'), classes);

            return lessons
                .map((lesson): Lesson => {
                    const date = dayjs(lesson.date);
                    const lesson_class = hash_classes[lesson.classId];
                    const course = hash_courses[lesson_class.courseId];
                    const month_num = date.get('month') as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
                    const month = tDict(`month.${month_num}`);
                    const manager_id = lesson_class.managerIds[0];

                    return {
                        origin_date: lesson.date,
                        date: date.format('D'),
                        month,
                        week_day: date.format('dddd'),
                        time_interval: `${lesson.beginTime}-${lesson.endTime}`,
                        course_type: course_type_map[course.courseType],
                        courseType: course.courseType,
                        filial: hash_filials[lesson.filialId].name.toLowerCase(),
                        icon: filial_map[lesson.filialId] ?? '❔',
                        lesson_class: hash_classes[lesson.classId],
                        address: address_map[lesson.roomId] ?? '',
                        beginTime: lesson.beginTime,
                        endTime: lesson.endTime,
                        manager_id
                    };
                })
                .reduce<Array<Lesson>>((acc, item) => {
                    if (!acc.length || item.courseType !== 'personal') {
                        acc.push(item);
                        return acc;
                    }
                    const lesson = acc[acc.length - 1];

                    if (lesson.endTime === item.beginTime && lesson.lesson_class === item.lesson_class) {
                        lesson.endTime = item.endTime;
                        lesson.time_interval = `${lesson.beginTime}-${item.endTime}`;
                    } else {
                        acc.push(item);
                    }

                    return acc;
                }, []);
        });

type Lesson = {
    origin_date: string;
    date: string;
    month: string;
    week_day: string;
    time_interval: string;
    course_type: string;
    filial: string;
    icon: string;
    lesson_class: ClassesResponse;
    address: string;
    courseType: CurseResponse['courseType'];
    beginTime: string;
    endTime: string;
    manager_id: number;
}
