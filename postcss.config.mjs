// Tailwind v4 runs only on stylesheets that `@import "tailwindcss"` — i.e.
// app/t/woof-wash/woofwash.css (the woof-wash premium template). The block
// renderer's app/globals.css is plain CSS and passes through untouched, so
// the other tenants + /admin + /connect are unaffected.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
