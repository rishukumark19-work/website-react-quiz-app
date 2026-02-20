# 📘 Reactor Quiz - Project Handbook & Learning Guide

Welcome to your **React Quiz Web Application**! This project is designed not just to "work", but to teach you **how** it works.

This guide acts as your **Senior Developer Mentor**. It breaks down everything from the requirements to the code, explaining "why" we made certain decisions.

## 📚 Table of Contents (Read in Order)

1.  [**Step 1: Start & Basics**](./01_start_basics.md)
    - How to run the project.
    - Understanding `index.html`, `main.jsx`, and `App.jsx`.
2.  [**Step 2: Structure & Styles**](./02_structure_styles.md)
    - Folder organization.
    - SCSS Mixins and Variables.
3.  [**Step 3: State Management (The Brain)**](./03_state_management.md)
    - How `QuizContext` works.
    - Using LocalStorage.
4.  [**Step 4: Custom Hooks (The Helpers)**](./04_custom_hooks.md)
    - `useTimer`: The countdown logic.
    - `useDebounce`: Optimizing search.
5.  [**Step 5: Reusable Components**](./05_reusable_components.md)
    - `Input`, `Button`, `QuizCard`.
6.  [**Step 6: Quiz List Page**](./06_page_quiz_list.md)
    - Searching, Filtering, and Skeleton Loading.
7.  [**Step 7: Creating a Quiz**](./07_page_quiz_create.md)
    - Complex forms, validation, and dynamic fields.
8.  [**Step 8: Taking a Quiz**](./08_page_quiz_attempt.md)
    - The Game Loop, Timer, and Answer Selection.
9.  [**Step 9: The Results**](./09_page_quiz_result.md)
    - Calculating scores and showing feedback.
10. [**Part 10: Common Questions (Viva Prep)**](./10_common_questions.md)
    - Answers to "Why did you do X?"
11. [**Part 11: Data Flow Diagrams**](./11_architecture_diagrams.md)
    - Visual maps of how the app works.
12. [**Part 12: Deployment Guide**](./12_deployment.md)
    - How to deploy React Vite apps to GitHub Pages.
    - Specific fixes for SCSS, Routing, and Permissions.

---

## 🎯 The Mission (Understanding Requirements)

Before writing a single line of code, we must understand **what** we are building.

### The Goal

Build a React App where users can:

1.  **Create** custom quizzes (Title, Time Limit, Questions).
2.  **Take** these quizzes with a real-time countdown timer.
3.  **See Results** immediately after finishing.

### Key Technical Terms Explained (Beginner Dictionary)

| Term                   | Simple Explanation                                                                                   | Where we use it                               |
| :--------------------- | :--------------------------------------------------------------------------------------------------- | :-------------------------------------------- |
| **React**              | A library for building UIs with "Components" (Lego blocks).                                          | Everywhere!                                   |
| **Component**          | A reusable piece of UI (e.g., `<Button />`, `<QuizCard />`).                                         | `/src/components`                             |
| **State (`useState`)** | The "memory" of a component. If data changes, React re-renders the component.                        | Storing form inputs, current question, score. |
| **Context API**        | A way to share data (like the list of quizzes) with _all_ components without passing props manually. | `QuizContext.jsx`                             |
| **Router**             | Handles navigation (URL changes) without reloading the page.                                         | `App.jsx`, `react-router-dom`                 |
| **SCSS / Mixins**      | CSS with superpowers. "Mixins" let you reuse groups of styles.                                       | `/src/styles`                                 |
| **LocalStorage**       | A small database in your browser. We use it to save quizzes so they don't disappear on refresh.      | `QuizContext.jsx`                             |
