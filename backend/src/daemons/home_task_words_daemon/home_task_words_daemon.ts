import * as console from '../../utils/log';
import { HomeTaskWebhook, WebhookHomeTaskStatus } from '../../types/general';
import { HOME_TASK_WORDS_REG, knex, MAX_WORD_LENGTH, MESSAGE_BUS } from '../../constants';
import { get_lesson_by_id } from '../../utils/request_mk';
import { always, propEq } from 'ramda';
import { Word, WordSource, WordStatus } from '../../types/Wokobular';
import { randomUUID } from 'crypto';
import { delete_old_info } from './delete_old_info';
import { add_home_task_data } from './add_home_task_data';

const info = console.info.bind(null, 'Home task daemon:');
const warn = console.warn.bind(null, 'Home task daemon:');
const error = console.error.bind(null, 'Home task daemon:');

export const home_task_words_daemon = () => {
    info(`Launch!`);

    const prepare_lesson = (task: HomeTaskWebhook): Promise<unknown> => {
        if (task.status === WebhookHomeTaskStatus.Done) {
            return Promise.resolve();
        }

        return get_lesson_by_id(task.lesson_id)
            .then((data) => {
                const insert_id = randomUUID();
                const { homeTask, records } = data;

                const visitors = records
                    ? records.filter(propEq(true, 'visit'))
                    : [];

                const home_task_text = homeTask?.text ?? '';

                const words = Array.from(home_task_text.matchAll(HOME_TASK_WORDS_REG))
                    .map<Omit<Word, 'id'>>(([_, en, ru]) => ({
                        ru: ru.trim(),
                        en: en.trim(),
                        status: WordStatus.Active,
                        source: WordSource.HomeTask,
                        insert_id
                    }))
                    .filter((word) => {
                        if (word.ru.length > MAX_WORD_LENGTH || word.en.length > MAX_WORD_LENGTH) {
                            warn(`Wrong word length!`, word);
                            return false;
                        }
                        if (!word.ru || !word.en) {
                            warn(`Wrong word length!`, word);
                            return false;
                        }
                        return true;
                    });

                if (!words.length || !visitors.length) {
                    info(`No words or visitors for home task!`);
                }

                return delete_old_info(task.lesson_id)
                    .then(() => add_home_task_data({
                        lesson_id: task.lesson_id,
                        insert_id,
                        words,
                        visitors
                    }))
                    .then(() =>
                        knex('home_task_webhook')
                            .update('status', WebhookHomeTaskStatus.Done)
                            .where('lesson_id', task.lesson_id)
                            .then(always(void 0))
                    );
            });
    };

    knex('home_task_webhook')
        .select('*')
        .where('status', WebhookHomeTaskStatus.Pending)
        .then(list => {
            const iterator = list[Symbol.iterator]();

            const loop = (iterator: Iterator<HomeTaskWebhook>): void | Promise<unknown> => {
                const { done, value } = iterator.next();

                if (!value || done) {
                    info(`All tasks complete!`);
                    return void 0;
                }

                return prepare_lesson(value)
                    .then(() => loop(iterator));
            };

            loop(iterator);
        });

    MESSAGE_BUS.on('home_task_update', prepare_lesson);
};