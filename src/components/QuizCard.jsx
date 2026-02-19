import React from "react";
import { Link } from "react-router-dom";
import "./QuizCard.scss";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="quiz-card">
      <div className="card-content">
        <h3>{quiz.title}</h3>
        <p className="description">{quiz.description}</p>
        <div className="meta">
          <span>{quiz.questions.length} Questions</span>
          <span>{quiz.timeLimit} mins</span>
        </div>
      </div>
      <div className="card-actions">
        <Link to={`/attempt/${quiz.id}`} className="start-btn">
          Start Quiz
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(quiz.id)}
            className="delete-btn"
            title="Delete Quiz"
          >
            Trash
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
