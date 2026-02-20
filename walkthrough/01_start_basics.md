# Part 1: How to Start & Basic Setup (Extensive Guide)

This guide is the absolute starting point. It explains how to run the project and, more importantly, **how the application actually loads and works under the hood.** We will dissect the critical files line-by-line so you understand exactly what React and Vite are doing.

---

## 1. How to Run the Project

Before diving into code, let's get the app running.

### Prerequisites

- **Node.js**: You must have Node.js installed (it's the runtime that lets us run JavaScript outside the browser).

### Steps

1.  **Open Terminal**: Use VS Code's terminal (`Ctrl + ~`) or your system terminal.
2.  **Navigate**: Make sure you are in the `website-quiz-1` folder.
    ```bash
    cd <path-to-folder>/website-quiz-1
    ```
3.  **Install Libraries**:
    ```bash
    npm install
    ```

    - **What this does**: It reads `package.json`, looks at the `dependencies` list, and downloads all of them (React, Router, etc.) into the `node_modules` folder.
4.  **Start Server**:
    ```bash
    npm run dev
    ```

    - **What this does**: It runs the `dev` script from `package.json`. This starts **Vite**, which serves your app at a local URL (usually `http://localhost:5173`).

---

## 2. The Architecture: Single Page Application (SPA)

This is a **Single Page Application**. This concept is crucial.

- **Standard Website (Multi-Page)**: When you click "About", the browser requests `about.html` from the server. The screen goes white, the page reloads, and new HTML appears.
- **React App (Single-Page)**:
  - There is only **ONE** HTML file: `index.html`.
  - When you click links, the browser **does not reload**.
  - React intercepts the click, erases the current content on the screen, and "paints" the new content instantly using JavaScript.
  - **Benefit**: It feels incredibly fast and smooth, like a mobile app.

---

## 3. Dissecting the Code: The "Chain of Command"

How does the app know what to show? It follows a strict chain from HTML -> JS -> React Components.

### Step 1: The Stage (`index.html`)

This is the only HTML file in the project. It sits in the root folder.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Quiz App</title>
  </head>
  <body>
    <!-- THE MOUNT POINT -->
    <div id="root"></div>

    <!-- THE TRIGGER -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Detailed Breakdown:**

1.  **`<div id="root"></div>`**:
    - **The Container**: This is an empty `div`. It is the _only_ part of the HTML body that matters to React.
    - **The Concept**: React will literally "take over" this element. Everything you write in React will be injected _inside_ these two tags.
    - **Why is it empty?**: because React fills it dynamically when the JavaScript loads.

2.  **`<script type="module" src="/src/main.jsx">`**:
    - **The Entry Point**: This tells the browser: "Hey, don't just sit there. Go load this JavaScript file."
    - **`type="module"`**: This acts as a modern JS module, allowing us to use `import` and `export` in our code (essential for React).

---

### Step 2: The Director (`src/main.jsx`)

This file is where React "wakes up". It finds the HTML container and starts the application.

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuizProvider>
      <App />
    </QuizProvider>
  </StrictMode>,
);
```

**Detailed Breakdown:**

1.  **`import ...`**:
    - We bring in `React` (the library), `createRoot` (the tool to attach to HTML), and our own components like `App` and `QuizProvider`.
    - `import './index.css'`: This applies your global styles immediately.

2.  **`document.getElementById('root')`**:
    - This is standard JavaScript. It searches the DOM (the web page) for that empty `div` we saw in `index.html`.

3.  **`createRoot(...).render(...)`**:
    - **`createRoot`**: This initializes React 18's new "Concurrent Mode". It creates a React root container.
    - **`.render(...)`**: This command says: "Take everything inside these parenthesis and put it inside the 'root' div."

4.  **The Wrapper Components**:
    - **`<StrictMode>`**: A development tool. It runs extra checks on your code. It does NOT render anything visible.
    - **`<QuizProvider>`**: (Context API) This wraps the _entire_ app. By doing this here, every single component inside `<App />` gets access to the Quiz Data. This is how we share global state.
    - **`<App />`**: The start of _your_ custom UI code.

---

### Step 3: The Traffic Controller (`src/App.jsx`)

`main.jsx` loaded `App.jsx`. Now `App.jsx` decides _which page_ to show based on the URL.

```jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizList from "./pages/QuizList";
import QuizCreate from "./pages/QuizCreate";
// ... other imports

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Route Definitions */}
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<QuizCreate />} />
          <Route path="/attempt/:id" element={<QuizAttempt />} />
        </Routes>
      </div>
    </Router>
  );
}
```

**Detailed Breakdown:**

1.  **`Router` (`BrowserRouter`)**:
    - This component connects React to the browser's URL bar. It watches for changes (like when you click back/forward).

2.  **`Routes`**:
    - Think of this as a `Switch` statement. It looks at the current URL and checks the `Route`s inside it one by one.

3.  **`Route`**:
    - **`path="/"`**: When the URL is simply `domain.com/` (Home), show...
    - **`element={<QuizList />}`**: ...the Quiz List component.
4.  **Dynamic Routing (`/attempt/:id`)**:
    - **The Colon `:`**: This is special. It tells React that `:id` is a **variable** (a placeholder), not the word "id".
    - **Example**:
      - URL: `/attempt/123` -> ID is "123".
      - URL: `/attempt/abc` -> ID is "abc".
    - The `QuizAttempt` component can then read this ID to know _which_ quiz to load.

---

## 4. The Engine Room (`package.json`)

This file is the manifest for your project.

- **`name` & `version`**: Metadata about your project.
- **`scripts`**: Shortcuts for terminal commands.
  - `"dev": "vite"` -> Runs the dev server.
  - `"build": "vite build"` -> Compiles the app for production.
- **`dependencies`**: The libraries your code _needs_ to run (React, React Router).
- **`devDependencies`**: The tools needed to _build_ the code (Vite, ESLint, Sass), but not needed by the user's browser.

## 5. Why Vite?

We use **Vite** instead of Create React App (CRA) because:

1.  **Speed**: It starts instantly. CRA can take minutes for large apps.
2.  **HMR (Hot Module Replacement)**: When you save a file, only that specific component updates in the browser. You don't lose your place or your form data.
3.  **Modern**: It uses native browser modules (ESM) which makes it incredibly efficient.
