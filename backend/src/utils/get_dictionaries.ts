import { get_classes, get_courses, get_filials, get_rooms } from './request_mk';

export const get_dictionaries = () =>
    Promise
        .all([
            get_filials(),
            get_courses(),
            get_classes(),
            get_rooms()
        ]);