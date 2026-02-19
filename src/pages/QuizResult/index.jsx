import React, { useMemo } from "react";
import { useLocation, Link, Navigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import "./style.scss";

const QuizResult = () => {
  const { id } = useParams();
  const location = useLocation();

  // extract state
  const state = location.state || {};
  const { quiz, answers, timeLeft, totalTime, autoSubmitted } = state;

  const results = useMemo(() => {
    // no data
    if (!quiz || !answers) {
      return {
        score: 0,
        total: 0,
        percentage: 0,
        message: "",
        breakdown: [],
      };
    }

    let correctCount = 0;
    const total = quiz.questions.length;

    const breakdown = quiz.questions.map((q, index) => {
      const userAns = answers[index] || [];
      const correctOptIndices = q.options
        .map((opt, i) => (opt.isCorrect ? i : -1))
        .filter((i) => i !== -1);

      let isCorrect = false;

      if (q.type === "single") {
        // check user answer
        const singleAns = userAns.length > 0 ? userAns[0] : -1;
        isCorrect = correctOptIndices.includes(singleAns);
      } else {
        // multiple choice check
        const sortedUser = [...userAns].sort();
        const sortedCorrect = [...correctOptIndices].sort();
        isCorrect =
          JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
      }

      if (isCorrect) correctCount++;

      return {
        question: q,
        userAns,
        correctOptIndices,
        isCorrect,
      };
    });

    const percentage = Math.round((correctCount / total) * 100);

    // feedback
    let message = "";
    if (percentage >= 80) message = "Excellent Work! 🌟";
    else if (percentage >= 50) message = "Good Job! 👍";
    else message = "Better Luck Next Time! 💪";

    return {
      score: correctCount,
      total,
      percentage,
      message,
      breakdown,
    };
  }, [quiz, answers]);

  // render guard
  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const timeTaken = totalTime - timeLeft;

  return (
    <div className="quiz-result-page">
      <div className="result-card">
        <h1>Quiz Results</h1>
        <h3>{quiz.title}</h3>

        <div className="score-circle">
          <span className="percentage">{results.percentage}%</span>
          <span className="score-text">
            {results.score} / {results.total}
          </span>
        </div>

        {/* message */}
        <h3
          style={{
            textAlign: "center",
            margin: "1rem 0",
            color: "#333",
            fontSize: "1.2rem",
          }}
        >
          {results.message}
        </h3>

        <div className="stats-grid">
          <div className="stat">
            <label>Time Taken</label>
            <span>{formatTime(timeTaken)}</span>
          </div>
          <div className="stat">
            <label>Status</label>
            <span className={results.percentage >= 50 ? "pass" : "fail"}>
              {results.percentage >= 50 ? "Passed" : "Failed"}
            </span>
          </div>
        </div>

        {autoSubmitted && (
          <div className="time-up-msg">
            Time's up! Your answers were automatically submitted.
          </div>
        )}

        <div className="actions">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link to={`/attempt/${id}`}>
            <Button variant="primary">Retake Quiz</Button>
          </Link>
        </div>
      </div>

      <div className="breakdown-section">
        <h3>Detailed Analysis</h3>
        {results.breakdown.map((item, idx) => (
          <div
            key={idx}
            className={`question-review ${item.isCorrect ? "correct" : "incorrect"}`}
          >
            <div className="review-header">
              <span className="q-num">Q{idx + 1}</span>
              <h4>{item.question.questionText}</h4>
              <span className="badge">
                {item.isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>
            <div className="options-review">
              {item.question.options.map((opt, optIdx) => {
                const isSelected = item.userAns.includes(optIdx);
                const isCorrect = item.correctOptIndices.includes(optIdx); // correct option

                let className = "opt-review";
                if (isSelected && isCorrect) className += " user-correct";
                else if (isSelected && !isCorrect) className += " user-wrong";
                else if (!isSelected && isCorrect) className += " missed";
                else className += " neutral";

                return (
                  <div key={optIdx} className={className}>
                    <span className="marker">
                      {isCorrect && "✓"}
                      {isSelected && !isCorrect && "✗"}
                      {!isSelected && !isCorrect && "•"}
                    </span>
                    <span className="text">{opt.text}</span>
                    {isCorrect && (
                      <span className="label">(Correct Answer)</span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="label">(Your Answer)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResult;
