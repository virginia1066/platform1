export const themeParams = {
    'bg_color': Telegram.WebApp.themeParams.bg_color ?? '#ffffff',
    'button_color': Telegram.WebApp.themeParams.button_color ?? '#5AC8FB',
    'button_text_color': Telegram.WebApp.themeParams.button_text_color ?? '#ffffff',
    'hint_color': Telegram.WebApp.themeParams.hint_color ?? '#8E8E8E',
    'link_color': Telegram.WebApp.themeParams.link_color ?? '#3E7FD2',
    'secondary_bg_color': (Telegram.WebApp.themeParams as any).secondary_bg_color ?? '#F3F2F8',
    'text_color': Telegram.WebApp.themeParams.text_color ?? '#020202',
};

export const colorScheme = 'light' //The color scheme currently used in the Telegram app. Either “light” or “dark”. Also available as the CSS variable var(--tg-color-scheme).