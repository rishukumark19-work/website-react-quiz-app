# Deploying React + Vite to GitHub Pages - Extensive Guide

This guide explains how to deploy your React application to GitHub Pages, focusing on the specific configuration needed for Vite and React Router.

---

## 1. Prerequisites

- **GitHub Repository**: You need a repository on GitHub (public or private).
- **Vite Project**: A working React app created with Vite.
- **Node.js**: Installed on your machine.

---

## 2. Configuration Steps

### Step 1: Tell Vite where it lives (`vite.config.js`)

By default, Vite assumes your app is at `https://domain.com/`. But on GitHub Pages, it usually lives at `https://pawangah.github.io/my-quiz-app/`.
We must set the `base` path.

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/website-quiz-1/", // REPLACE THIS WITH YOUR REPO NAME
});
```

### Step 2: Use HashRouter (`src/App.jsx`)

GitHub Pages is a **static file host**. It doesn't know how to handle "client-side routing" urls like `/create` or `/attempt/123`. If you refresh on those pages, you get a 404 error.
We switch to `HashRouter`, which uses the `#` symbol (e.g., `/#/create`) to manage routes purely in the browser.

```javascript
// src/App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>{/* ... all your routes ... */}</Routes>
      </div>
    </Router>
  );
}
```

---

## 3. Deployment (The Manual Way)

This is the simplest method for beginners.

1.  **Build the Project**:
    ```bash
    npm run build
    ```

    - This creates a `dist` folder with optimized HTML, CSS, and JS files.
2.  **Push the `dist` folder**:
    - You specifically push _only_ the contents of `dist` to a branch called `gh-pages`.
    - There is a helper tool for this: `gh-pages`.
      ```bash
      npm install gh-pages --save-dev
      ```
    - Add this script to `package.json`:
      ```json
      "scripts": {
        "deploy": "gh-pages -d dist",
        ...
      }
      ```
    - Run it:
      ```bash
      npm run deploy
      ```

---

## 4. Deployment (The Automated Way - Recommended)

We use **GitHub Actions** to automatically build and deploy every time you push code.

1.  Create a file: `.github/workflows/deploy.yml`
2.  Paste this YAML config:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install and Build
        run: |
          npm install
          npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

3.  **Push** this file to GitHub.
4.  Go to your Repository **Settings -> Pages**.
    - Source: **Deploy from a branch**.
    - Branch: **gh-pages** (This branch is created automatically by the Action).

---

## 5. Troubleshooting Common Issues

### Issue 1: Blank White Screen

- **Cause**: You forgot to set `base` in `vite.config.js` or used `BrowserRouter`.
- **Fix**: Switch to `HashRouter` and double-check the repo name in `vite.config.js`.

### Issue 2: Images not loading

- **Cause**: Referring to images as `/assets/img.png`.
- **Fix**: Use the `import` syntax or standard public folder reference.
  - Correct: `<img src="/website-quiz-1/vite.svg" />` (include base path).
  - Better: `import myImg from './assets/img.png'` -> `<img src={myImg} />`.

### Issue 3: Permissions Error

- **Cause**: GitHub Action fails with "Permission denied".
- **Fix**: Check the `permissions: contents: write` line in your YAML file. It allows the bot to push code to your repo.
