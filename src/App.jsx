import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizList from "./pages/QuizList";
import QuizCreate from "./pages/QuizCreate";
import QuizAttempt from "./pages/QuizAttempt";
import QuizResult from "./pages/QuizResult";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<QuizCreate />} />
          <Route path="/attempt/:id" element={<QuizAttempt />} />
          <Route path="/result/:id" element={<QuizResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
