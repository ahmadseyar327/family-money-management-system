/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                secondary: '#0f172a',
                accent: '#8b5cf6',
                success: '#10b981',
                error: '#ef4444',
                'bg-main': '#020617',
                'bg-card': 'rgba(30, 41, 59, 0.5)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
