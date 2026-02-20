# Part 9: Calculating Scores (Quiz Result) - Extensive Guide

The **QuizResult** page (`src/pages/QuizResult/index.jsx`) is pure mathematics. It receives the user's answers, compares them against the correct answers, and displays feedback.

---

## 1. Receiving Data (`useLocation`)

This page doesn't fetch from an API or Context. It reads data passed from the _previous_ page (QuizAttempt).

```javascript
import { useLocation, Navigate } from "react-router-dom";

const QuizResult = () => {
  const location = useLocation(); // Hook to access router state
  const { quiz, answers } = location.state || {}; // Careful! It might be undefined

  // Safety Check: If someone goes to domain.com/result/123 manually
  if (!quiz || !answers) {
    return <Navigate to="/" replace />; // Redirect home
  }

  // ... continued
};
```

**Why protect against manual navigation?**
If a user just types the URL, `location.state` will be `undefined`. The app would crash ("Cannot read property of undefined"). Always handle this case!

---

## 2. Scoring Logic (The Algorithm)

We calculate the score _once_ when the page loads using `useMemo`.

```javascript
const score = useMemo(() => {
  let correctCount = 0;

  // Loop through every question
  quiz.questions.forEach((question) => {
    const userAns = answers[question.id] || []; // Get user's selection (array)
    // Get ALL correct option IDs
    const correctOptIds = question.options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id);

    // COMPARE THE ARRAYS
    if (question.type === "single") {
      // Simple equality check
      if (userAns[0] === correctOptIds[0]) correctCount++;
    } else {
      // Multiple choice
      // Complex equality check: Arrays must match EXACTLY
      // Sort both arrays to ensure order doesn't matter ([A,B] == [B,A])
      const userSorted = [...userAns].sort();
      const correctSorted = [...correctOptIds].sort();

      // JSON.stringify is a quick way to compare simple arrays
      if (JSON.stringify(userSorted) === JSON.stringify(correctSorted)) {
        correctCount++;
      }
    }
  });

  return correctCount;
}, [quiz, answers]); // Recalculate only if data changes
```

**Key Concepts:**

1.  **Immutability in Comparison**:
    - `[1, 2] === [1, 2]` is `false` in JavaScript (referential equality).
    - We use `JSON.stringify(arr1) === JSON.stringify(arr2)` or a deeper comparison function.
2.  **Sorting**: The user might have selected `[B, A]`, but the correct array is `[A, B]`. By sorting, we ensure they match.

---

## 3. Retrying the Quiz

We allow users to "Try Again". Since the data isn't saved permanently, we just link back to the attempt page.

```jsx
<Link to={`/attempt/${quiz.id}`} className="btn btn-primary">
  Retake Quiz
</Link>
```

**State Reset**: Since `QuizAttempt` initializes its state (`answers = {}`) on mount, simply navigating to `domain.com/attempt/123` starts a fresh quiz automatically. No manual "reset" function needed.

---

## 4. Visual Feedback (Review Mode)

We render the question list again, but this time we highlight answers.

```jsx
{
  /* Loop through options */
}
question.options.map((option) => {
  // Is this option correct?
  const isAnswerCorrect = option.isCorrect;
  // Did the user pick this?
  const isSelected = userAns.includes(option.id);

  let className = "option";
  if (isSelected && isAnswerCorrect) className += " correct-choice";
  if (isSelected && !isAnswerCorrect) className += " wrong-choice";
  if (!isSelected && isAnswerCorrect) className += " missed-correct";

  return <div className={className}>{option.text}</div>;
});
```

This logic gives clear red/green feedback for every option.
