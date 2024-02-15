// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import ns1 from "../../../locales/ru/locale.json";


declare module "i18next" {
    // Extend CustomTypeOptions
    interface CustomTypeOptions {
        // custom namespace type, if you changed it
        defaultNS: "translation";
        // custom resources type
        resources: {
            translation: typeof ns1;
        };
        // other
    }
}