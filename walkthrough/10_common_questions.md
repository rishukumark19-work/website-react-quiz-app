# Part 10: Common Questions (Viva/Interview Prep) - Extensive Guide

If you are presenting this project for a college assignment or a job interview, these are the concepts you **must** understand.

---

## 1. React Fundamentals

### Q: Why did you use `context` instead of just passing props?

**The "Prop Drilling" Problem:**
"In a standard React app, data flows top-down. If I have a list of quizzes in `App.jsx` and I need to display them in `QuizCard.jsx`, I have to pass them through `QuizList.jsx` first.
Now imagine `QuizCard` has a `DeleteButton`. The `delete` function has to be passed `App -> QuizList -> QuizCard -> DeleteButton`. This is 'Prop Drilling'.
**The Solution:**
Context acts like a teleportation device. I wrapped the app in a `QuizProvider`. Now, any component can just 'ask' for the data directly, bypassing the middle layers. It makes the code cleaner and easier to scale."

### Q: What is the Virtual DOM and does this app use it?

**Answer:**
"Yes, React uses the Virtual DOM.

1.  **Real DOM**: The actual HTML structure of the page. Changing it is slow.
2.  **Virtual DOM**: A lightweight copy of the DOM in JavaScript memory.
    **How it works:** When I update the quiz timer, React doesn't re-paint the whole page. It updates the Virtual DOM, compares it to the previous version (Diffing), and calculates the _minimum_ changes needed (e.g., just changing the text '10:00' to '09:59'). This makes the app performant."

### Q: Explain the `useEffect` dependency array `[]`.

**Answer:**
"`useEffect` handles side-effects like fetching data or setting timers. The array `[]` at the end tells React _when_ to run this effect.

- `[]` (Empty): Run **only once** when the component first loads (Mount). I use this for fetching the quizzes from LocalStorage.
- `[timeLeft]` (With variable): Run **every time** `timeLeft` changes. I use this for the Countdown Timer.
- No array: Run on **every single render**. This is dangerous and causes infinite loops."

---

## 2. Logic & State

### Q: How does the "Live Search" work without freezing the browser?

**Answer:**
"I used a technique called **Debouncing**.
If a user types 'React', normally the app would try to filter the list 5 times (R, Re, Rea, Reac, React). This is wasteful.
I created a custom hook `useDebounce`. It sets a timer for 500ms. If the user types again before 500ms, the timer resets. The filtering logic only runs _after_ the user stops typing for half a second. This reduces 5 expensive calculations to just 1."

### Q: Why use `useCallback` in the Timer?

**Answer:**
"In the `QuizAttempt` page, I pass a function `handleTimeUp` to my custom `useTimer` hook.
If I didn't use `useCallback`, React would re-create this function typically on every render. The `useEffect` inside the hook would see a 'new' function and reset the timer loop constantly. `useCallback` freezes the function definition so it stays the same across renders."

---

## 3. Styling (SCSS)

### Q: Why SCSS instead of standard CSS?

**Answer:**
"SCSS allows me to use **Variables** and **Mixins**, which keeps my code DRY (Don't Repeat Yourself).

- **Variables**: I defined `$primary-color` in one file. If I want to rebrand the site, I change that one line, and all buttons, borders, and text update instantly.
- **Mixins**: I created a `flex-center` mixin. Instead of writing 3 lines of flexbox code repeatedly, I just `@include flex-center`. It saves time and ensures consistency."

---

## 4. Data Persistence

### Q: Where is the database?

**Answer:**
"For this frontend-focused project, I used **localStorage** as a pseudo-database.

- When the app loads, `QuizContext` checks `localStorage.getItem('quizzes')`.
- When a user adds a quiz, `useEffect` detects the change and runs `localStorage.setItem(...)`.
  This allows data to persist even if you refresh the browser, mimicking a real full-stack application."
