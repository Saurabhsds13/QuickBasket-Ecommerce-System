// tailwind.config.js
module.exports = {
  // ... other configurations
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
        "slide-in-up": "slideInUp 1s ease-out forwards",
        "pop-in": "popIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "80%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
         pulseGlow: {
      '0%, 100%': { boxShadow: '0 0 10px rgba(34,197,94,0.4)' },
      '50%': { boxShadow: '0 0 20px rgba(34,197,94,0.7)' },
    },
     animation: {
    pulseGlow: 'pulseGlow 2s infinite',
  },
      },
    },
  },
  plugins: [],
};
