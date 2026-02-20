# Part 8: The Game Loop (Quiz Attempt) - Extensive Guide

The **QuizAttempt** page (`src/pages/QuizAttempt/index.jsx`) is the core experience. It handles user interactions, timing, and scoring logic under pressure.

---

## 1. Core Logic: "The State Machine"

We need to track several pieces of state simultaneously:

1.  **Which question are we on?** (`currentQuestionIndex`)
2.  **What answers have been selected?** (`answers`)
3.  **How much time is left?** (`timeLeft`)
4.  **Is the quiz submitted?** (`isSubmitted`)

```javascript
/* src/pages/QuizAttempt/index.jsx */
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedOptions, setSelectedOptions] = useState({}); // { questionId: [optionId] }
const [isSubmitted, setIsSubmitted] = useState(false);
```

### Why use `useState({})` for answers?

Instead of an array like `[ans1, ans2, ans3]`, we use an object (map) keyed by `questionId`:

```json
{
  "q1": ["optA"],
  "q2": ["optB", "optC"] // Multiple choice
}
```

**Why?** If we reorder questions later, the answers stay mapped correctly.

---

## 2. Handling Selection Logic

When a user clicks an option, the logic splits based on `question.type`:

### Single Choice Logic

Clicking Option B _replaces_ any previous selection.

```javascript
const handleSingleSelect = (questionId, optionId) => {
  setSelectedOptions((prev) => ({
    ...prev,
    [questionId]: [optionId], // Replace entire array with new ID
  }));
};
```

### Multiple Choice Logic

Clicking Option B _toggles_ it (add if missing, remove if present).

```javascript
const handleMultiSelect = (questionId, optionId) => {
  setSelectedOptions((prev) => {
    const currentList = prev[questionId] || []; // Get current selection or empty array

    if (currentList.includes(optionId)) {
      // Remove it
      return {
        ...prev,
        [questionId]: currentList.filter((id) => id !== optionId),
      };
    } else {
      // Add it
      return {
        ...prev,
        [questionId]: [...currentList, optionId],
      };
    }
  });
};
```

---

## 3. The Timer Integration

We use our `useTimer` hook, passing `handleTimeUp` as the callback.

```javascript
const handleTimeUp = useCallback(() => {
  setIsSubmitted(true); // Stop interactions
  alert("Time's Up!");
  handleSubmit(); // Force submit
}, []);

const { timeLeft } = useTimer(quiz.timeLimit * 60, handleTimeUp);
```

**Key Concept: `useCallback`**
Passing a function to a custom hook (or `useEffect`) creates a dependency loop. If `handleTimeUp` is recreated every render, the timer resets. `useCallback` freezes the function so it stays the same between renders.

---

## 4. Submission & Resetting Context

When the user clicks "Submit Quiz":

1.  **Calculate Score**: We calculate immediately based on selected options vs correct options.
2.  **Navigate**: We send the user to the Result page.
3.  **Pass State**: We pass the _entire_ quiz object + user answers to the next page via `location.state`. We do NOT save this attempt in the global `quizzes` list permanently (per SRS requirements).

```javascript
const navigate = useNavigate();

const handleSubmit = () => {
  // Pass data invisibly through the router
  navigate(`/result/${id}`, {
    state: {
      quiz: quiz,
      answers: selectedOptions, // "q1": ["optA"]
      timeTaken: quiz.timeLimit * 60 - timeLeft,
    },
  });
};
```

**Why pass via `state`?**
This avoids putting potentially huge data in the URL (e.g., `domain.com/result?ans=...`). It keeps the URL clean (`/result/123`) while transferring rich objects.

---

### Summary

This page implementation handles complex interaction logic (toggling selections) and timer side-effects. By keeping `selectedOptions` in a dictionary (object), we ensure robustness.
