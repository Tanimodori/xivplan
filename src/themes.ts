import { createTheme, DefaultPalette } from '@fluentui/react';
import { Theme, webDarkTheme, webLightTheme } from '@fluentui/react-components';

export const lightTheme = createTheme({
    palette: {
        themePrimary: '#0064b0',
        themeLighterAlt: '#f2f7fc',
        themeLighter: '#cce2f2',
        themeLight: '#a2c9e7',
        themeTertiary: '#539ad0',
        themeSecondary: '#1673b9',
        themeDarkAlt: '#005a9e',
        themeDark: '#004c86',
        themeDarker: '#003863',
        neutralLighterAlt: '#f6e4cc',
        neutralLighter: '#f2e0c9',
        neutralLight: '#e8d7c0',
        neutralQuaternaryAlt: '#d8c9b3',
        neutralQuaternary: '#cebfab',
        neutralTertiaryAlt: '#c6b8a4',
        neutralTertiary: '#a19f9d',
        neutralSecondary: '#605e5c',
        neutralPrimaryAlt: '#3b3a39',
        neutralPrimary: '#323130',
        neutralDark: '#201f1e',
        black: '#000000',
        white: '#fdebd1',
    },
});

export const darkTheme = createTheme({
    palette: {
        themePrimary: '#0091ff',
        themeLighterAlt: '#00060a',
        themeLighter: '#001729',
        themeLight: '#002b4d',
        themeTertiary: '#005799',
        themeSecondary: '#007fe0',
        themeDarkAlt: '#199cff',
        themeDark: '#3dabff',
        themeDarker: '#70c1ff',
        neutralLighterAlt: '#1e1e1e',
        neutralLighter: '#282828',
        neutralLight: '#363636',
        neutralQuaternaryAlt: '#404040',
        neutralQuaternary: '#474747',
        neutralTertiaryAlt: '#666666',
        neutralTertiary: '#e2e2e2',
        neutralSecondary: '#e7e7e7',
        neutralPrimaryAlt: '#ebebeb',
        neutralPrimary: '#d4d4d4',
        neutralDark: '#f5f5f5',
        black: '#fafafa',
        white: '#141414',
        purple: '#9865cf',
        blackTranslucent40: DefaultPalette.whiteTranslucent40,
        whiteTranslucent40: DefaultPalette.blackTranslucent40,
    },
    semanticColors: {
        inputBorder: '#8a8886',
    },
    isInverted: true,
});

export const lightTheme2: Theme = {
    ...webLightTheme,
    colorSubtleBackgroundHover: '#e8d7c0',
    colorNeutralBackground2: '#f6e4cc',
};

export const darkTheme2 = webDarkTheme;
