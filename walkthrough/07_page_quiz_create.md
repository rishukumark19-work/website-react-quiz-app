# Part 7: Complex Forms (Quiz Creation) - Extensive Guide

The **QuizCreate** page (`src/pages/QuizCreate/index.jsx`) is the engineering heavyweight of this app. It involves a dynamic form where the user can add an infinite number of questions, each with infinite options.

---

## 1. The Data Structure

Before coding, we must define the "Shape" of a Quiz.

```json
{
  "id": "1712938475",
  "title": "React Basics",
  "description": "Test your knowledge.",
  "timeLimit": 10,
  "questions": [
    {
      "id": "q1",
      "text": "What is a Hook?",
      "type": "single", // 'single' or 'multiple'
      "options": [
        { "id": "o1", "text": "A function", "isCorrect": true },
        { "id": "o2", "text": "A class", "isCorrect": false }
      ]
    }
  ]
}
```

**Why this structure?**

- **Nested Arrays**: `questions` is an array. `options` is an array _inside_ a question.
- **IDs**: Every item needs a unique ID so React knows what to update.

---

## 2. Managing Complex State

We use a single state object `quizData` to hold everything.

```javascript
const [quizData, setQuizData] = useState({
  title: "",
  description: "",
  timeLimit: 10,
  questions: [],
});
```

### The Challenge: Nested Updates

Updating the **text of Option 2 in Question 5** is difficult because you cannot mutate the state directly. You must recreate the entire object tree.

**The "Immutability Pattern" for deeply nested updates:**

```javascript
// Example: Updating a question's text
const updateQuestionText = (questionId, newText) => {
  setQuizData((prev) => ({
    ...prev, // 1. Copy the main object
    questions: prev.questions.map((q) => {
      // 2. Loop through questions
      if (q.id === questionId) {
        // 3. Find the one to change and return a COPY with new text
        return { ...q, text: newText };
      }
      return q; // 4. Return others unchanged
    }),
  }));
};
```

This pattern (`map` -> `if match` -> `copy` -> `else return`) is standard React practice for arrays.

---

## 3. Dynamic Form Fields (Adding/Removing)

The UI allows users to click "Add Question" or "Add Option".

### Adding a Question

We simply push a new "template" object into the array.

```javascript
const addQuestion = () => {
  const newQuestion = {
    id: Date.now(), // Generate ID
    text: "",
    type: "single",
    options: [
      // Start with 2 empty options
      { id: Date.now() + 1, text: "", isCorrect: false },
      { id: Date.now() + 2, text: "", isCorrect: false },
    ],
  };

  setQuizData((prev) => ({
    ...prev,
    questions: [...prev.questions, newQuestion],
  }));
};
```

### Deleting a Question

We use `.filter()` to exclude the item.

```javascript
const removeQuestion = (idToRemove) => {
  setQuizData((prev) => ({
    ...prev,
    questions: prev.questions.filter((q) => q.id !== idToRemove),
  }));
};
```

---

## 4. The "Wizard" Steps

We split the huge form into two steps using a simple state variable:
`const [currentStep, setCurrentStep] = useState(1);`

- **Step 1**: Basic Info (Title, Description, Time).
- **Step 2**: Questions Editor.

**Conditional Rendering:**

```jsx
return (
  <div className="create-page">
    {currentStep === 1 && (
      <StepOneForm data={quizData} onChange={...} />
    )}

    {currentStep === 2 && (
      <StepTwoForm data={quizData} onAddQuestion={...} />
    )}
  </div>
);
```

---

## 5. Validation Logic

We can't let users submit a quiz without a title or with empty questions.

```javascript
const validateStep2 = () => {
  // Check if there are questions
  if (quizData.questions.length === 0) {
    alert("Add at least one question!");
    return false;
  }

  // Check every question
  for (let q of quizData.questions) {
    if (!q.text.trim()) {
      alert("All questions must have text!");
      return false;
    }
    // Check if at least one correct answer is selected
    const hasCorrect = q.options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      alert("Select a correct answer for: " + q.text);
      return false;
    }
  }
  return true;
};
```

**Key Concept**: We prevent the "Submit" action if validation fails.

---

### Summary

This page teaches **Deep State Updates** and **Dynamic Lists**. These are the most common "hard" tasks in React development. Mastering `...spread` syntax and `.map()` is essential here.
