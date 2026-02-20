import React from "react";
import "./QuizCardSkeleton.scss"; //skeleton for loading

const QuizCardSkeleton = () => {
  return (
    <div className="quiz-card-skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-desc"></div>
      <div className="skeleton-meta"></div>
      <div className="skeleton-action"></div>
    </div>
  );
};

export default QuizCardSkeleton;
