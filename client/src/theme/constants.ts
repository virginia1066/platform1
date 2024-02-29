export const spaces = {
    '0': '0px',
    '1': '1px',
    '2': '4px',
    '3': '8px',
    '4': '12px',
    '5': '16px',
    '6': '20px',
    '7': '24px',
    '8': '32px',
    '9': '64px',
    '10': '128px'
}

export const fontSizes = {
    xs: "0.875rem",
    sm: "1rem",
    md: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    xxl: "3rem",
}

export const breakpoints = {
    xs: '360px',
    sm: '480px',
    md: '768px',
    lg: '992px',
    xl: '1280px',
    '2xl': '1536px', //old 1536px
}

export const sizes = {
    sizes: {
        ...spaces,
        max: 'max-content',
        min: 'min-content',
        full: '100%',
        '3xs': '14rem',
        '2xs': '16rem',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        '8xl': '90rem',
        container: {
            sm: breakpoints.sm,
            md: breakpoints.md,
            lg: '1024px',
            xl: breakpoints.xl,
            '2xl': breakpoints["2xl"],
        },
    },
}
