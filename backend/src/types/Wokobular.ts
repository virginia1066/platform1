import { Card } from 'fsrs.js';
import { Replace } from './utils';

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
}

export type BaseCard<Date = string> = Replace<Card, 'due' | 'last_review', Date>;

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
}

export enum WordStatus {
    Active = 'ACTIVE',
    Deleted = 'DELETED'
}

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
}

export type LearnCard<Date = string> = BaseCard<Date> & {
    id: number;
    word_id: number;
    student_id: number;
}
