import { get_classes, get_courses, get_filials } from './request_mk';

export const get_dictionaries = () =>
    Promise
        .all([
            get_filials(),
            get_courses(),
            get_classes(),
        ]);