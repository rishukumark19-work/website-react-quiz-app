# Part 3: State Management (The Brain) - Extensive Guide

This section explains the **Global State Architecture**. We use React's built-in **Context API** to manage data across the entire application without the complexity of external libraries like Redux.

---

## 1. The Core Problem: Prop Drilling

Imagine you have a family tree:
`Grandparent -> Parent -> Child -> Grandchild`

If the **Grandparent** has money (Data) and wants to give it to the **Grandchild**, they have to pass it through the Parent and Child first, even if the Parent and Child don't need the money.

In React, this is called **Prop Drilling**:
`App -> QuizList -> QuizCard -> EditButton`

If `App` holds the list of quizzes, but `EditButton` needs to delete a quiz, you have to pass the `deleteQuiz` function down through _every single layer_. This makes code messy, hard to read, and fragile.

---

## 2. The Solution: Context API (The "Broadcast System")

The Context API solves this by creating a **"Teleporter"**.

1.  **The Context (`createContext`)**: This defines the "type" of data we are sharing. Think of it as creating a dedicated radio frequency.
2.  **The Provider (`<QuizProvider>`)**: This is the Broadcast Tower. It wraps a section of your app (usually the whole thing). Any component _inside_ this wrapper can tune in to the broadcast.
3.  **The Consumer (`useContext`)**: This is the Radio Receiver. Any component, no matter how deep in the tree, can simply "tune in" and get the data directly from the Provider.

---

## 3. Dissecting `QuizContext.jsx`

This file is the single source of truth for all quiz data.

```jsx
// src/context/QuizContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

// 1. CREATE THE CONTEXT
const QuizContext = createContext();

// 2. CREATE THE PROVIDER COMPONENT
export const QuizProvider = ({ children }) => {
  // 3. DEFINE THE STATE (The actual data)
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. LOAD DATA ON STARTUP
  useEffect(() => {
    const stored = localStorage.getItem("quiz-app-data");
    if (stored) {
      setQuizzes(JSON.parse(stored));
    }
    setLoading(false);
  }, []); // Empty dependency array = Run only once when app mounts

  // 5. SAVE DATA ON CHANGE
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("quiz-app-data", JSON.stringify(quizzes));
    }
  }, [quizzes, loading]); // Run every time 'quizzes' changes

  // 6. DEFINE ACTIONS (How to change data)
  const addQuiz = (quiz) => {
    const newQuiz = { ...quiz, id: Date.now().toString() };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const deleteQuiz = (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  // 7. EXPORT THE VALUE
  return (
    <QuizContext.Provider value={{ quizzes, loading, addQuiz, deleteQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

// 8. CUSTOM HOOK FOR EASY ACCESS
export const useQuiz = () => useContext(QuizContext);
```

### Detailed Breakdown:

1.  **`createContext()`**: Creates the empty context object.
2.  **`{ children }`**: This is a special React prop. It represents _everything_ inside the `<QuizProvider>...</QuizProvider>` tags in `main.jsx`. By rendering `{children}`, we allow the app to render normally, just with extra data available invisibly.
3.  **`useState([])`**: The `quizzes` state starts as an empty array. This is where the _actual_ list lives in memory.
4.  **`useEffect` (Loading)**:
    - **Trigger**: Runs once on mount (startup).
    - **Logic**: Checks `localStorage`. Since LocalStorage only stores strings, we must use `JSON.parse()` to turn it back into a JavaScript Array.
5.  **`useEffect` (Saving)**:
    - **Trigger**: Runs whenever `quizzes` changes.
    - **Logic**: Takes the current array, converts it to a string with `JSON.stringify()`, and saves it to the browser's disk.
    - **Why `!loading`?**: prevents overwriting valid saved data with an empty array during the initial split-second load.
6.  **`addQuiz`**:
    - **Immutability**: We never do `quizzes.push()`. Instead, we use `setQuizzes(prev => [...prev, newQuiz])`. This creates a _new_ array with the old items plus the new one. This is crucial for React to detect the change and update the screen.
7.  **`deleteQuiz`**:
    - Uses `.filter()`. It creates a new array containing only the quizzes that _don't_ match the ID we want to delete.
8.  **`useQuiz` Hook**:
    - Instead of importing `useContext` and `QuizContext` in every file, we create a shortcut. Components just type `const { quizzes } = useQuiz();`.

---

## 4. Why LocalStorage?

We use `localStorage` for **Persistence**.

- **Without it**: If you refresh the page, the JavaScript memory is wiped, and all quizzes disappear.
- **With it**: The data stays in the browser's hard drive until explicitly cleared.

In a real production app (like Facebook), you would use a **Database** (Backend API) instead of LocalStorage. LocalStorage is strictly for this client-side demo.
