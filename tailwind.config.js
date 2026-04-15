/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#B9FF66',
                'secondary': '#191A23',
                'dark': '#191A23',
                'light': '#F3F3F3',
            },
            fontFamily: {
                'space': ['"Space Grotesk"', 'sans-serif'],
            },
            borderRadius: {
                'positivus': '14px',
            },
            boxShadow: {
                'positivus': '0 5px 0 0 #191A23',
            }
        },
    },
    plugins: [],
}
