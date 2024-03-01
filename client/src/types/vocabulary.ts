export type DeckStats = {
    count_new: number;
    count_learning: number;
    count_review: number;
    count_relearning: number;
    words_count: number;
    count_can_be_shown: number;
};

export type DeckItemShort = {
    id: number;
    name: string;
    user_can_edit: boolean;
    stats: DeckStats;
};

export type DeckItemDetailed = DeckItemShort & {
    words: Array<Word>;
}

export type Word = {
    id: number;
    ru: string;
    en: string;
}

