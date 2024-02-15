import dayjs from 'dayjs';

export const format_mk_date = (date: string): string =>
    dayjs(date, 'YYYY-MM-DD').format('DD.MM.YYYY');