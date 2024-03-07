import { State } from 'fsrs.js';

export enum PackStatus {
    Active = 'ACTIVE',
    Deleted = 'Deleted'
}

/**
 * Колода
 */
export type Pack = {
    /**
     * Название колоды в интерфейсе
     */
    name: string;
    /**
     * id колоды
     */
    id: number;
    /**
     * Кому доступна колода. Колода с parent_user_id = 0 считается системной и доступна всем
     */
    parent_user_id: number;
    /**
     * Статус колоды
     */
    status: PackStatus;
    /**
     * Может ли быть отредактирована пользователем
     */
    user_can_edit: boolean;
    /**
     * Id вставки (для удаления)
     */
    insert_id: string;
}

/**
 * Связи колоды со словами
 */
export type PackLink = {
    /**
     * id колоды
     */
    pack_id: number;
    /**
     * id слова в колоде
     */
    word_id: number;
    /**
     * Id вставки (для удаления)
     */
    insert_id: string;
}

export enum WordStatus {
    Active = 'ACTIVE',
    Deleted = 'DELETED'
}

export enum WordSourcePrefix {
    GoogleSheets = 'GOOGLE',
    HomeTask = 'HOME_TASK',
    UserAdd = 'USER_ADD'
}

type WordSource = WordSourcePrefix.GoogleSheets
    | `${WordSourcePrefix.HomeTask}-${number}`
    | `${WordSourcePrefix.UserAdd}-${number}`

/**
 * Слово
 * связь (ru/en для сова должна быть уникальна на уровне БД)
 */
export type Word = {
    /**
     * id слова
     */
    id: number;
    /**
     * Текст слова на русском
     */
    ru: string;
    /**
     * Текст слова на англиском
     */
    en: string;
    /**
     * Статус слова
     */
    status: WordStatus;
    /**
     * Источник получения слова
     */
    source: WordSource;
    /**
     * Id вставки (для удаления)
     */
    insert_id: string;
}

export type LessonUpdate<Date = string> = {
    lesson_id: number;
    insert_id: string;
    timestamp: Date;
}

export type LearnCard<Date = string> = {
    /**
     * Id слова к которому привязана карточка
     */
    word_id: number;
    /**
     * Id студента
     */
    student_id: number;
    /**
     * Дата когда должно быть показано слово в следующий раз
     */
    due: Date;
    /**
     * Это числовое значение, представляющее стабильность (устойчивость) запоминания карточки.
     * Более высокие значения стабильности могут указывать на то,
     * что карточка легче запоминается и менее подвержена забыванию.
     * @type Decimal
     */
    stability: number;
    /**
     * Это числовое значение, представляющее сложность карточки. Более высокие значения сложности могут указывать на то,
     * что карточка труднее запоминается и может требовать больше усилий для повторения.
     * @type Decimal
     */
    difficulty: number;
    /**
     * Это число дней, прошедших с момента последнего повторения карточки.
     * Оно используется для расчета оптимального времени для следующего повторения.
     * @type Decimal
     */
    elapsed_days: number;
    /**
     * Это число дней, запланированных между последним повторением и следующим запланированным повторением карточки.
     * Оно также используется для определения оптимального времени повторения.
     * @type Decimal
     */
    scheduled_days: number;
    /**
     * Это количество повторений карточки, сделанных до сих пор.
     * Оно отражает, сколько раз карточка была повторена в процессе обучения.
     * @type Int
     */
    reps: number;
    /**
     *  Это количество "сбоев" или ошибок в запоминании карточки. Это число может указывать на то,
     *  как часто карточка вызывает затруднения при повторении,
     *  что может потребовать дополнительных усилий для запоминания.
     *  @type Int
     */
    lapses: number;
    /**
     * Это состояние карточки, которое может быть представлено перечислением (enum) State. Оно может указывать на то,
     * в какой стадии обучения находится карточка (например, новая, в процессе изучения, на повторении и т. д.).
     */
    state: State;
    /**
     *  Это дата последнего повторения карточки. Она указывает на последний момент времени,
     *  когда карточка была повторена для запоминания.
     */
    last_review: Date;
}
