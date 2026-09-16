/**
 * LocalRead Centralized Typography Configuration
 * Thay đổi font tại đây sẽ tự động cập nhật toàn bộ ứng dụng.
 */
const FONTS = {
  // Font chính cho Tiêu đề, Bìa sách, Thư viện và Nội dung đọc
  serif: ["Fraunces", "Georgia", "serif"],
  // Font phụ cho UI labels, buttons, navigation
  sans: ["Plus Jakarta Sans", "Inter", "-apple-system", "sans-serif"],
  // Font typewriter cho mã số, tỷ lệ phần trăm, số trang cổ điển
  mono: ["Courier Prime", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Quiet Library Design Tokens
        primary: {
          DEFAULT: "#243624",
          container: "#3a4d39",
          fixed: "#d2e9ce",
          "fixed-dim": "#b7cdb2",
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#a7bda4",
        "on-primary-fixed": "#0e1f0f",
        "on-primary-fixed-variant": "#394b38",

        secondary: {
          DEFAULT: "#6c5b51",
          container: "#f6ded1",
          fixed: "#f6ded1",
          "fixed-dim": "#d9c2b6",
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#726157",
        "on-secondary-fixed": "#251911",
        "on-secondary-fixed-variant": "#53443a",

        tertiary: {
          DEFAULT: "#442d1c",
          container: "#5d4330",
          fixed: "#ffdcc5",
          "fixed-dim": "#e5bfa7",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#d5b098",
        "on-tertiary-fixed": "#2b1707",
        "on-tertiary-fixed-variant": "#5b412f",

        surface: {
          DEFAULT: "#fff8f5",
          dim: "#e1d8d4",
          bright: "#fff8f5",
          variant: "#e9e1dc",
          "container-lowest": "#ffffff",
          "container-low": "#fbf2ed",
          container: "#f5ece7",
          "container-high": "#efe6e2",
          "container-highest": "#e9e1dc",
          tint: "#50634e",
        },
        "on-surface": "#1e1b18",
        "on-surface-variant": "#434842",
        "inverse-surface": "#34302c",
        "inverse-on-surface": "#f8efea",
        "inverse-primary": "#b7cdb2",

        background: "#fff8f5",
        "on-background": "#1e1b18",

        outline: "#747871",
        "outline-variant": "#c3c8bf",

        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Sepia & Dark overrides for reader
        sepia: {
          bg: "#FBF0D9",
          app: "#F4E8C1",
          surface: "#FBF0D9",
          text: "#433422",
          subtext: "#78644E",
          border: "#E5D5B3",
        },
        darkreader: {
          bg: "#161616",
          app: "#121212",
          surface: "#1E1E1E",
          text: "#E2E8F0",
          subtext: "#94A3B8",
          border: "#2C2C2C",
        }
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.375rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
        full: "9999px",
      },
      fontFamily: {
        serif: FONTS.serif,
        display: FONTS.serif,
        body: FONTS.serif,
        sans: FONTS.sans,
        label: FONTS.sans,
        mono: FONTS.mono,
        "display-lg": FONTS.serif,
        "headline-lg": FONTS.serif,
        "headline-md": FONTS.serif,
        "headline-sm": FONTS.serif,
        "body-lg": FONTS.serif,
        "body-md": FONTS.serif,
        "body-sm": FONTS.sans,
        "label-lg": FONTS.sans,
        "label-md": FONTS.sans,
        "label-sm": FONTS.sans,
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "500" }],
        "body-lg": ["19px", { lineHeight: "32px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.03em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      boxShadow: {
        paper: "0 2px 10px rgba(44, 40, 37, 0.04), 0 1px 3px rgba(44, 40, 37, 0.02)",
        "paper-elevated": "0 8px 30px rgba(44, 40, 37, 0.06), 0 2px 6px rgba(44, 40, 37, 0.03)",
        "book-spine": "inset 12px 0 16px -8px rgba(0, 0, 0, 0.28)",
        "book-tactile": "1px 1px 0px rgba(0, 0, 0, 0.1), 4px 6px 16px -2px rgba(44, 38, 34, 0.14)",
        "book-tactile-hover": "1px 2px 0px rgba(0, 0, 0, 0.12), 8px 14px 28px -4px rgba(44, 38, 34, 0.22)",
      }
    },
  },
  plugins: [],
}
