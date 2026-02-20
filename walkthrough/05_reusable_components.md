# Part 5: Reusable Components (The UI Bricks) - Extensive Guide

In a React app, we follow the **"Don't Repeat Yourself" (DRY)** principle.

If you have to copy-paste the same `<div>` block more than twice, make it a component.

---

## 1. The Strategy: Dumb Components

We separate our components into:

1.  **Dumb (UI) Components**: Buttons, Inputs, Cards.
    - They don't know about "Users" or "Quizzes".
    - They just receive data (Props) and show it.
2.  **Smart (Page) Components**: QuizList, QuizCreate.
    - These handle the logic and fetch data.

---

## 2. `Button.jsx` (Click Me)

This is the most reused component.

### Why not just `<button>`?

- **Consistency**: Every button in the app looks the same (padding, border-radius).
- **Maintainability**: To change the primary color from Blue to Purple, modify `Button.scss` once.

### Code Explained

```jsx
// src/components/Button/index.jsx
import "./style.scss";

const Button = ({
  children, // The text inside passd: <Button>Click Me</Button>
  onClick, // The function to run on click
  type = "button", // Default to 'button' (could be 'submit')
  variant = "primary", // 'primary', 'secondary', 'danger'
  className = "", // Allow extra custom classes
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`} // Dynamic class
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

**Key Concepts**:

1.  **Defaults (`type = 'button'`)**: We set safe defaults so you don't break the app if you forget a prop.
2.  **`children`**: This special prop lets us write `<Button><span>Icon</span> Save</Button>`. Whatever is inside the tags becomes `children`.
3.  **Dynamic Classes**: `btn-${variant}` lets the parent decide the color scheme.
    - If `variant="danger"`, class becomes `btn btn-danger`.

---

## 3. `Input.jsx` (Type Here)

Inputs are tricky because they need labels, error messages, and accessibility features.

### Code Explained

```jsx
// src/components/Input/index.jsx
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}) => {
  return (
    <div className="input-group">
      {/* 1. Only show label if provided */}
      {label && <label className="input-label">{label}</label>}

      {/* 2. The actual input */}
      <input
        className={`input-field ${error ? "input-error" : ""}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {/* 3. Show error message if exists */}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};
```

**Key Concepts**:

1.  **Controlled Component**: We pass `value` and `onChange` from the parent. The input doesn't manage its own state; the parent does.
2.  **Complexity Hiding**: The parent just writes `<Input label="Email" error={errorMsg} />`. All the complex HTML structure (divs, spans, classes) is hidden inside this component.

---

## 4. `QuizCard.jsx` (The Display Brick)

This component shows a summary of a quiz on the home page.

### Code Walkthrough

```jsx
// src/components/QuizCard/index.jsx
import { Link } from "react-router-dom";
import formatTime from "../../utils/formatTime"; // Helper function

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="quiz-card">
      <h3>{quiz.title}</h3>

      <div className="quiz-details">
        {/* Conditional rendering: Only show details if they exist */}
        <span>{quiz.questions.length} Questions</span>
        <span>{formatTime(quiz.timeLimit)} mins</span>
      </div>

      <div className="card-actions">
        {/* Link to the Attempt Page */}
        <Link to={`/attempt/${quiz.id}`} className="btn-start">
          Start
        </Link>

        {/* Delete Button */}
        <button onClick={() => onDelete(quiz.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
};
```

**Key Concepts**:

- **Props (`{ quiz }`)**: We pass the _entire_ quiz object as a prop. This is clean data flow.
- **`Link` (React Router)**: We use `<Link>` instead of `<a>` standard tags.
  - `<a>`: Reloads the page (bad for SPA).
  - `<Link>`: Updates the URL and view instantly without reload.

---

### Summary

By building these reusable components first, the actual "Pages" become very simple. They just assemble these bricks.
