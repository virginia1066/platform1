import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationRU from './locales/ru/translation.json';
import 'intl-pluralrules';

i18n
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        lng: 'ru',
        fallbackLng: 'ru',
        debug: true,
        defaultNS: 'translation',
        resources: {
            ru: {
                translation: translationRU,
            },
        },
    });

export default i18n;