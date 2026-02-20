# Part 4: Custom Hooks (The Helpers) - Extensive Guide

React Hooks allow us to "hook into" React features like state and lifecycle methods. **Custom Hooks** are JavaScript functions that start with `use`. They let us extract messy logic from our components, making the UI code clean and readable.

---

## 1. `useTimer.js` (The Countdown)

We need a countdown timer for the Quiz Attempt page. Instead of writing complex `setInterval` logic inside the page component, we hide it in this hook.

### The Problem it Solves

If we put timer logic directly in `QuizAttempt.jsx`, the component would be huge. Also, if we wanted another timer somewhere else, we'd have to copy-paste code.

### The Code Explained

```javascript
// src/hooks/useTimer.js
import { useState, useEffect } from "react";

const useTimer = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // 1. EXIT EARLY
    if (timeLeft <= 0) {
      onTimeUp(); // Call the function passed from the parent
      return;
    }

    // 2. SET UP THE INTERVAL
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000); // Run every 1000ms (1 second)

    // 3. CLEAN UP (Crucial Role!)
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]); // Re-run if timeLeft changes

  // Helper to format 65 seconds into "1:05"
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return { timeLeft, formatTime };
};
```

### Key Concepts

1.  **`setInterval`**: This is a browser function that runs code repeatedly.
2.  **The Cleanup Function (`return () => ...`)**:
    - **Why?** If the user leaves the page before the timer ends, the interval _keeps running in the background_. This causes errors ("Can't update state on unmounted component") and slows down the browser.
    - **React's Solution**: When the component is destroyed (unmounted), React runs this cleanup function to stop the timer.

---

## 2. `useDebounce.js` (The Search Optimizer)

This hook is a requirement for "Performance Optimization" in the SRS.

### The Problem: "The Chatterbox"

Imagine a user types "React" into the search bar.

1.  Type "R" -> App filters list for "R".
2.  Type "e" -> App filters list for "Re".
3.  Type "a" -> App filters list for "Rea".
    ...and so on.

If the list has 10,000 items, filtering 5 times in 1 second freeze the browser.

### The Solution: " The Waiter"

We wait until the user _stops typing_ for a specific time (e.g., 500ms) before we run the filter.

### The Code Explained

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  // 1. State to hold the "safe" value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 2. Set a timer to update the value later
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. CANCEL the timer if value changes before time is up!
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Run every time the user types a character

  return debouncedValue;
}
```

### Step-by-Step Scenario

User types "A", then "B" quickly.

1.  **User types "A"**: `value` becomes "A". Effect runs. `setTimeout` starts (scheduled for 500ms later).
2.  **User types "B" (100ms later)**: `value` becomes "AB".
    - React sees `value` changed.
    - **Cleanup runs first**: `clearTimeout` kills the timer from step 1. "A" is never set.
    - **New Effect runs**: New `setTimeout` starts (scheduled for 500ms later).
3.  **User stops**:
    - 500ms passes.
    - `setTimeout` fires. `setDebouncedValue("AB")` runs.
    - The expensive filtering logic (in the component) finally runs **once**.
