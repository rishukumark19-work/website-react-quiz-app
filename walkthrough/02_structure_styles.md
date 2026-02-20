# Part 2: Folder Structure & Styling (Extensive Guide)

This section explains the **Mental Model** behind how we organize our code and the **System** we use for styling. We don't just dump files anywhere; we follow a strict architecture to make the app scalable and maintainable.

---

## 1. The Component-Based Architecture

React revolves around **Components**. A component is a reusable piece of UI (like a button, a form, or a whole page).

### Folder Structure Explained

We follow a standard "Feature-First" or "Type-First" organization.

```
/src
  /assets      -> Images, fonts, static files.
  /components  -> Reusable UI bricks (Buttons, Inputs, Cards).
  /context     -> The "Brain" (Global State).
  /hooks       -> Custom Logic Helpers (e.g., useTimer).
  /pages       -> The "Views" (Full screens).
  /styles      -> The "Theme" (Global SCSS).
  App.jsx      -> The Router.
  main.jsx     -> The Entry Point.
```

### Why distinguish `components` vs `pages`?

- **Components**: These are "dumb" UI elements. They don't know about the URL or the global app state usually. They just receive data (props) and show it.
  - _Example_: `<Button />`, `<QuizCard />`, `<InputField />`.
- **Pages**: These are "smart" containers. They correspond to a Route (URL). They fetch data, talk to the Global Context, and organize the "dumb" components into a full view.
  - _Example_: `<QuizList />` (The page) fetches quizzes and renders a list of `<QuizCard />` (The component).

---

## 2. SCSS Architecture: The "Design System"

We use **SCSS (Sass)**, which is CSS with superpowers. It allows variables, nesting, and mixins.

### Why not just plain CSS?

- **Maintainability**: If you want to change the primary color from Blue to Purple, in CSS you have to find-and-replace 50 files. In SCSS, you change **one variable**.
- **Consistency**: We define "tokens" (spacing, colors, fonts) so every part of the app looks related.

### The Foundation Files (`/src/styles/`)

#### 1. `_variables.scss` (The Truth)

This file contains the "Design Tokens". It is the source of truth for the app's look.

```scss
// _variables.scss
$primary-color: #6366f1; // Indigo-500
$secondary-color: #ec4899; // Pink-500
$text-dark: #1f2937; // Gray-800
$text-light: #f3f4f6; // Gray-100
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$border-radius: 8px;
```

#### 2. `_mixins.scss` (The Tools)

Mixins are reusable blocks of CSS code. They function like JavaScript functions but for styles.

**Mixin 1: `flex-center`**
Every time you want to center something perfectly, you use this.

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**Mixin 2: `button-style`**
This ensures all buttons have the same shape, padding, and hover effects, but can have different colors.

```scss
@mixin button-style($bg, $color) {
  background-color: $bg;
  color: $color;
  padding: 0.75rem 1.5rem;
  border-radius: $border-radius;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px); // Subtle lift effect
    filter: brightness(110%);
  }
}
```

**Mixin 3: `responsive`**
This handles mobile responsiveness cleanly.

```scss
@mixin mobile {
  @media (max-width: 768px) {
    @content; // This allows us to pass custom styles here
  }
}
```

### How Components Use Styles

We don't write one giant CSS file. Each component imports what it needs.

```scss
/* QuizCard.scss */
@use "../../styles/variables" as *; // Import variables
@use "../../styles/mixins" as *; // Import tools

.quiz-card {
  background: white;
  border-radius: $border-radius; // Use variable
  padding: $spacing-md;

  .card-header {
    @include flex-center; // Use mixin
    margin-bottom: $spacing-md;
  }

  button {
    @include button-style($primary-color, white); // Use mixin with arguments
  }
}
```

- **`@use`**: This is the modern Sass way (replacing `@import`). It prevents variable name collisions.
- **`@include`**: This "Pastes" the mixin code right here.

---

## 3. Global Styles (`index.css` vs `main.scss`)

- **`index.css`**: We use this for **Tailwind-like resets**. It strips away browser default margins and padding so every browser (Chrome, Safari, Edge) starts from a blank slate.
- **`main.scss`**: This would be the place for global typography (setting the font family on `body`) and background colors that apply to the whole app.
