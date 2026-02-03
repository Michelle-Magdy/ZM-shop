/** @type {import('tailwindcss').Config} */
export const content = [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
];
export const plugins = [];
export const darkMode = 'class';
export const theme = {
    extend: {
        colors: {
            brand: {
                light: '#3b82f6', // blue for light theme
                dark: '#2563eb',  // darker blue for dark theme
            },
            background: {
                light: '#f9fafb', // light bg
                dark: '#111827',  // dark bg
            },
            text: {
                light: '#1f2937', // dark text in light theme
                dark: '#f9fafb',  // light text in dark theme
            },
        }
    },
};