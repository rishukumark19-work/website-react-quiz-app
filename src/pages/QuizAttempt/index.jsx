import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizzes } from "../../hooks/useQuizzes";
import useTimer from "../../hooks/useTimer";
import Button from "../../components/ui/Button";
import "./style.scss";

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuiz, loading } = useQuizzes();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // store answers
  const [isSubmitted, setIsSubmitted] = useState(false);

  // load quiz
  useEffect(() => {
    if (!loading && !quiz) {
      const foundQuiz = getQuiz(id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        navigate("/");
      }
    }
  }, [id, loading, getQuiz, navigate, quiz]);

  // submit callback

  // handle timeout
  const handleTimeUp = useCallback(() => {
    //autosubmit on timer end
    if (!isSubmitted) {
      // navigate result
      navigate(`/result/${id}`, {
        state: {
          quiz,
          answers,
          timeLeft: 0,
          totalTime: quiz.timeLimit * 60,
          autoSubmitted: true,
        },
      });
    }
  }, [id, isSubmitted, navigate, quiz, answers]);

  // timer hook
  const { timeLeft, formatTime } = useTimer(
    //time reamaing
    quiz ? quiz.timeLimit : 0,
    handleTimeUp,
  );

  // manual submit
  const handleManualSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    navigate(`/result/${id}`, {
      state: {
        quiz,
        answers,
        timeLeft, // current time
        totalTime: quiz.timeLimit * 60,
        autoSubmitted: false,
      },
    });
  };

  const handleAnswer = (optionIndex, isMulti) => {
    setAnswers((prev) => {
      const currentAnswers = prev[currentQuestionIndex] || [];
      let newAnswers;

      if (isMulti) {
        if (currentAnswers.includes(optionIndex)) {
          newAnswers = currentAnswers.filter((i) => i !== optionIndex);
        } else {
          newAnswers = [...currentAnswers, optionIndex];
        }
      } else {
        newAnswers = [optionIndex];
      }

      return {
        ...prev,
        [currentQuestionIndex]: newAnswers,
      };
    });
  };

  if (loading || !quiz) {
    return <div className="loading-screen">Loading Quiz...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // guard check
  if (!currentQuestion) {
    return <div>Error loading question.</div>;
  }

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const currentAnswers = answers[currentQuestionIndex] || [];

  // flash alert
  const isWarning = timeLeft <= 10; //warning red flash

  return (
    <div
      className={`quiz-attempt-page ${isWarning ? "timer-flash-container" : ""}`}
    >
      <header className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className={`timer ${isWarning ? "warning" : ""}`}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </header>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="question-container">
        <div className="question-header">
          <span className="q-number">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <h3 className="q-text">{currentQuestion.questionText}</h3>
          <span className="q-type">
            {currentQuestion.type === "multiple"
              ? "(Select all that apply)"
              : "(Select one)"}
          </span>
        </div>

        <div className="options-list">
          {currentQuestion.options.map((option, idx) => (
            <div
              key={idx}
              className={`option-item ${currentAnswers.includes(idx) ? "selected" : ""}`}
              onClick={() =>
                handleAnswer(idx, currentQuestion.type === "multiple")
              }
            >
              <span className="opt-marker">
                {currentQuestion.type === "single" ? (
                  <span
                    className={`radio ${currentAnswers.includes(idx) ? "checked" : ""}`}
                  ></span>
                ) : (
                  <span
                    className={`checkbox ${currentAnswers.includes(idx) ? "checked" : ""}`}
                  ></span>
                )}
              </span>
              <span className="opt-text">{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="quiz-footer">
        <Button
          variant="secondary"
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
          }
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button variant="success" onClick={handleManualSubmit}>
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(quiz.questions.length - 1, prev + 1),
              )
            }
          >
            Next
          </Button>
        )}
      </footer>
    </div>
  );
};

export default QuizAttempt;
