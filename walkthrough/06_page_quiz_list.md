# Part 6: Visualizing Data (Quiz List Page) - Extensive Guide

The **QuizList** page (`src/pages/QuizList/index.jsx`) is the first thing users see. It demonstrates the complete flow: fetching data, handling loading states, filtering, sorting, and displaying it.

---

## 1. The Strategy: "Fetch-Render"

The page follows a standard React pattern:

1.  **Mount**: "I'm alive!"
2.  **Fetch**: "Get me the data (from Context)."
3.  **Render Loading**: "Hold on..."
4.  **Render Data**: "Here is the list."

---

## 2. Code Breakdown: The Setup

```javascript
// src/pages/QuizList/index.jsx
import { useState, useMemo } from 'react';
import { useQuiz } from '../../context/QuizContext.jsx';
import QuizCard from '../../components/QuizCard';
import Input from '../../components/Input';
import useDebounce from '../../hooks/useDebounce';

const QuizList = () => {
  // 1. GET DATA FROM CONTEXT
  const { quizzes, loading, deleteQuiz } = useQuiz();

  // 2. LOCAL STATE FOR UI
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'name'

  // 3. OPTIMIZE SEARCH (Debounce)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // Only updates 500ms after typing stops
```

**Key Concepts**:

- **Context usage**: We don't fetch from an API here; we get `quizzes` from our global store.
- **Local State**: `searchTerm` and `sortBy` affect _only this page_, so they stay local (useState).

---

## 3. The Logic: Filtering & Sorting (`useMemo`)

This is the most complex part. We have a raw list of quizzes, but we need to show a filtered, sorted version.

**Why `useMemo`?**
If we just wrote `const filtered = quizzes.filter(...)`, this calculation would run **every single time** the component re-renders (e.g., typing one letter). With 1000 items, that's slow. `useMemo` caches the result and only re-runs if `quizzes` or the filter criteria changes.

```javascript
const processedQuizzes = useMemo(() => {
  // 1. FILTER FIRST (Always easier to sort a smaller list)
  let result = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  // 2. SORT SECOND
  if (sortBy === "newest") {
    // Dates are strings logic: "2023-10-01" > "2023-01-01"
    // We convert to Date objects to be safe
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === "name") {
    // Strings: "Apple" comes before "Banana"
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
}, [quizzes, debouncedSearchTerm, sortBy]);
// Dependency Array: Recalculate ONLY if these change
```

**Key Concepts**:

- **Chaining Operations**: Filter -> Sort. This is efficient.
- **Immutability**: `.filter()` returns a new array (good). `.sort()` mutates the array in place (bad in raw Redux, but okay here since `.filter` already made a copy).

---

## 4. The UI: Skeleton Loading

Instead of showing a boring "Loading..." text, we show **Skeleton Cards**. These are gray boxes that mimic the shape of the content.

**Why?**
It reduces "Layout Shift" (CLS). By reserving the space, the page doesn't jump around when data loads.

```jsx
// Inside Return
return (
  <div className="quiz-list-page">
    {/* Header & Controls */}
    <div className="header">
      <Input
        placeholder="Search quizzes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Sort Dropdown */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Newest First</option>
        <option value="name">A-Z</option>
      </select>
    </div>

    {/* The List Grid */}
    <div className="quiz-grid">
      {loading
        ? // SHOW 6 FAKE CARDS
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="quiz-card-skeleton"></div>
          ))
        : // SHOW REAL CARDS
          processedQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
    </div>

    {/* Empty State */}
    {!loading && processedQuizzes.length === 0 && (
      <div className="empty-state">No quizzes found!</div>
    )}
  </div>
);
```

**Key Concepts**:

- **Key Prop (`key={quiz.id}`)**: This is mandatory in React lists. It helps React identify which items have changed, added, or removed. Using `index` is bad if the list can be re-ordered (which ours can!).
- **Conditional Rendering**: We heavily use the ternary operator `condition ? true : false`.

---

### Summary

This page showcases the power of **derived state**. We have `quizzes` (raw data), but we display `processedQuizzes` (filtered/sorted view). We never modify the original `quizzes` just to sort the view. This preserves data integrity.
