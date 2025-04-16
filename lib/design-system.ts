// Design system constants for the Ryzer Wallet Application
// This centralizes our design tokens for consistent application

export const COLORS = {
  // Primary brand colors
  primary: {
    50: "hsl(260, 100%, 97%)",
    100: "hsl(260, 100%, 94%)",
    200: "hsl(260, 95%, 86%)",
    300: "hsl(260, 90%, 76%)",
    400: "hsl(260, 85%, 65%)",
    500: "hsl(260, 84%, 60%)", // Main brand purple
    600: "hsl(260, 84%, 50%)",
    700: "hsl(260, 84%, 40%)",
    800: "hsl(260, 84%, 30%)",
    900: "hsl(260, 84%, 20%)",
  },
  // Neutral colors
  gray: {
    50: "hsl(220, 20%, 98%)",
    100: "hsl(220, 15%, 95%)",
    200: "hsl(220, 15%, 91%)",
    300: "hsl(220, 13%, 85%)",
    400: "hsl(220, 10%, 70%)",
    500: "hsl(220, 9%, 46%)",
    600: "hsl(220, 8%, 35%)",
    700: "hsl(220, 7%, 25%)",
    800: "hsl(220, 7%, 17%)",
    900: "hsl(220, 10%, 10%)",
  },
  // Semantic colors
  success: {
    50: "hsl(142, 76%, 95%)",
    500: "hsl(142, 76%, 36%)",
    600: "hsl(142, 76%, 29%)",
  },
  warning: {
    50: "hsl(38, 92%, 95%)",
    500: "hsl(38, 92%, 50%)",
    600: "hsl(38, 92%, 40%)",
  },
  error: {
    50: "hsl(0, 84%, 95%)",
    500: "hsl(0, 84%, 60%)",
    600: "hsl(0, 84%, 50%)",
  },
  info: {
    50: "hsl(217, 91%, 95%)",
    500: "hsl(217, 91%, 60%)",
    600: "hsl(217, 91%, 50%)",
  },
}

export const SPACING = {
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
}

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
}

export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
}

export const TRANSITIONS = {
  DEFAULT: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  fast: "100ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  timing: {
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
}

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

export const Z_INDEX = {
  0: "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
  auto: "auto",
  dropdown: "1000",
  sticky: "1100",
  fixed: "1200",
  drawer: "1300",
  modal: "1400",
  popover: "1500",
  toast: "1600",
  tooltip: "1700",
}
