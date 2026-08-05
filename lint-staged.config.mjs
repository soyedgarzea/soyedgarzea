const config = {
  '*.{js,jsx,mjs,cjs,ts,tsx}': 'eslint --max-warnings=0',
  '*.{json,md,css,yml,yaml}': 'prettier --check',
};

export default config;
