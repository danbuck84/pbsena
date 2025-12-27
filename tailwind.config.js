/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#11d432",
                "primary-dark": "#0ea626", // Adjusted slightly dark
                "background-light": "#f6f8f6",
                "background-dark": "#102213",
                "surface-light": "#ffffff",
                "surface-dark": "#1a2e1d",
                "text-primary-light": "#111812",
                "text-primary-dark": "#e0e6e1",
                "text-secondary-light": "#618968",
                "text-secondary-dark": "#9ab09e",
                "accent-gold": "#FFD700",
                "danger": "#ef4444",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            boxShadow: {
                "glow": "0 0 15px rgba(17, 212, 50, 0.3)",
            }
        },
    },
    plugins: [],
}
