# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

name: F2expert CI/CD
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Cache Dependencies
        uses: actions/cache@v3
        with: 
          path: ~/.npm
          key: deps-node-modules-${{ hashFiles('**/package-lock.json') }}
      - name: Install Dependencies
        run: npm ci
      - name: Run Lint
        run: npm run lint
  test:
    name: Run Tests
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Cache Dependencies
        uses: actions/cache@v3
        with: 
          path: ~/.npm
          key: deps-node-modules-${{ hashFiles('**/package-lock.json') }}
      - name: Install Dependencies
        run: npm ci
      - name: Run Tests
        run: npm test
  build:
    name: Build Project
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Cache Dependencies
        uses: actions/cache@v3
        with: 
          path: ~/.npm
          key: deps-node-modules-${{ hashFiles('**/package-lock.json') }}
      - name: Install Dependencies
        run: npm ci
      - name: Build Next.js
        run: npm run build
  deploy:
    name: Deploy to F2expert
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Deployment
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: echo "vercels --prod"
