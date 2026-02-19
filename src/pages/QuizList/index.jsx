import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuizzes } from "../../hooks/useQuizzes";
import useDebounce from "../../hooks/useDebounce"; // Import custom debounce hook
import QuizCard from "../../components/QuizCard";
import QuizCardSkeleton from "../../components/QuizCardSkeleton";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import "./style.scss";

const QuizList = () => {
  const { quizzes, loading, deleteQuiz } = useQuizzes();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce delay 500ms
  const [sortBy, setSortBy] = useState("date"); // 'date' or 'name'

  const filteredQuizzes = useMemo(() => {
    let result = quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );

    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Date descending (newest first)
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [quizzes, debouncedSearchTerm, sortBy]);

  return (
    <div className="quiz-list-page">
      <nav className="simple-nav">
        <Link to="/">Home</Link>
        <Link to="/create">Create Quiz</Link>
      </nav>
      <header className="page-header">
        <h1>Available Quizzes</h1>
        <Link to="/create">
          <Button>Create New Quiz</Button>
        </Link>
      </header>

      <div className="filters-bar">
        <Input
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Newest</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="quiz-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <QuizCardSkeleton key={i} />)
        ) : filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onDelete={() => deleteQuiz(quiz.id)}
            />
          ))
        ) : (
          <div className="no-results">
            <p>
              No quizzes found. {searchTerm && "Try a different search term."}
            </p>
            {!searchTerm && <Link to="/create">Create one now!</Link>}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
