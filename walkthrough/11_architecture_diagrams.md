# Part 11: Architecture & Data Flow - Extensive Guide

Understanding the "Mental Model" of your application is key to debugging it. Here is how data moves through the system.

---

## 1. The Global State Flow (Context API)

The `QuizContext` acts as the single source of truth.

```mermaid
[ Browser LocalStorage ] <---(Persistent Data)---> [ QuizContext (Global State) ]
                                                          |
                                                          | Provides: { quizzes, addQuiz, deleteQuiz }
                                                          |
       +--------------------------------------------------+--------------------------------------------------+
       |                                                  |                                                  |
       v                                                  v                                                  v
[ QuizList Page ]                                [ QuizCreate Page ]                                [ QuizAttempt Page ]
       |                                                  |                                                  |
       |-- Renders List                                   |-- User Input                                     |-- Reads specific Quiz
       |-- Filters (Search)                               |-- Validation                                     |-- Tracks User Answers
       |-- Sorts (Date/Alpha)                             |-- Calls addQuiz()                                |-- Calculates Score
```

### Explanation

1.  **Mount**: App starts. `QuizContext` checks LocalStorage for saved data.
2.  **Hydrate**: If data exists, it populates `quizzes` state.
3.  **Distribute**: The `Provider` makes this state available to all 3 main pages.
4.  **Update**: When `QuizCreate` calls `addQuiz()`, `QuizContext` updates its state -> triggers a re-render of `QuizList` -> saves to LocalStorage.

---

## 2. Component Hierarchy

Everything flows downwards from `App`.

```
App (Router)
├── QuizList (Page)
│   ├── Input (Search Bar)
│   ├── Select (Sort Dropdown)
│   └── QuizCard (List Item)
│       ├── Link (To Attempt Page)
│       └── Button (Delete)
│
├── QuizCreate (Page)
│   ├── Step 1 Form
│   │   ├── Input (Title)
│   │   └── Input (Description)
│   └── Step 2 Form
│       ├── Button (Add Question)
│       └── Validation Logic
│
├── QuizAttempt (Page)
│   ├── useTimer (Hook)
│   ├── Header (Title + Countdown)
│   ├── Question Loop
│   │   └── Options (Radio/Checkbox)
│   └── Button (Submit)
│
└── QuizResult (Page)
    ├── Score Display
    ├── Review List (Questions with styling)
    └── Link (Retry)
```

---

## 3. The "Attempt" Logic Loop

This is the most complex logic flow in the app.

```text
START GAME
   |
   +-> Load Quiz ID from URL
   +-> Fetch Quiz Data from Context
   +-> Start Timer (useTimer Hook)
   |
   |---[ USER INTERACTION LOOP ]-----------------------+
   |                                                   |
   |  1. User Clicks Option                            |
   |  2. Check Type:                                   |
   |     a. Single Choice -> Replace Answer            |
   |     b. Multiple Choice -> Toggle (Add/Remove)     |
   |  3. Update Local State: { q1: [optA], q2: ... }   |
   |                                                   |
   +---------------------------------------------------+
   |
   +-> SUBMIT TRIGGER (Button Click OR Timer Ends)
   |
   +-> Calculate Score (Client-Side Math)
   |   - Compare Data vs User Input
   |
   +-> Navigate to Result Page
   |   - Pass { score, answers } via Location State
   |
   v
END GAME
```
