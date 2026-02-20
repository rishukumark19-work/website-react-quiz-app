import React from "react";
import "./style.scss";

const QuestionForm = ({ question, index, onChange, onDelete, errors = {} }) => {
  const handleTypeChange = (e) => {
    // reset correct status
    const newType = e.target.value;
    const updatedOptions = question.options.map((opt) => ({
      ...opt,
      isCorrect: false,
    }));
    onChange(index, { ...question, type: newType, options: updatedOptions });
  };

  const handleTextChange = (e) => {
    onChange(index, { ...question, questionText: e.target.value });
  };

  const handleOptionChange = (optionIndex, value) => {
    const updatedOptions = question.options.map((opt, i) =>
      i === optionIndex ? { ...opt, text: value } : opt,
    );
    onChange(index, { ...question, options: updatedOptions });
  };

  const handleCorrectChange = (optionIndex) => {
    //multiple choice question
    let updatedOptions;
    if (question.type === "single") {
      updatedOptions = question.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optionIndex,
      }));
    } else {
      updatedOptions = question.options.map((opt, i) =>
        i === optionIndex ? { ...opt, isCorrect: !opt.isCorrect } : opt,
      );
    }
    onChange(index, { ...question, options: updatedOptions });
  };

  const addOption = () => {
    const newOption = { id: Date.now(), text: "", isCorrect: false };
    onChange(index, { ...question, options: [...question.options, newOption] });
  };

  const removeOption = (optionIndex) => {
    const updatedOptions = question.options.filter((_, i) => i !== optionIndex);
    onChange(index, { ...question, options: updatedOptions });
  };

  return (
    <div className="question-card">
      <div className="card-header">
        <h4>Question {index + 1}</h4>
        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(index)}
          title="Delete Question"
        >
          &times;
        </button>
      </div>

      <div className="form-group">
        <label>Question Text</label>
        <input
          type="text"
          value={question.questionText}
          onChange={handleTextChange}
          placeholder="Enter the question..."
          className={errors.questionText ? "error" : ""}
        />
        {errors.questionText && (
          <span className="error-msg">{errors.questionText}</span>
        )}
      </div>

      <div className="form-group">
        <label>Type</label>
        <select value={question.type} onChange={handleTypeChange}>
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
        </select>
      </div>

      <div className="options-section">
        <label>Options (Check correct answer)</label>
        {question.options.map((option, optIndex) => (
          <div key={optIndex} className="option-row">
            <input
              type={question.type === "single" ? "radio" : "checkbox"}
              checked={option.isCorrect}
              onChange={() => handleCorrectChange(optIndex)}
              name={`q-${index}-correct`}
              className="correct-check"
            />
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(optIndex, e.target.value)}
              placeholder={`Option ${optIndex + 1}`}
              className={`option-input ${errors[`option${optIndex}`] ? "error" : ""}`}
            />
            <button
              type="button"
              onClick={() => removeOption(optIndex)}
              className="remove-opt-btn"
            >
              remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption} className="add-opt-btn">
          + Add Option
        </button>
        {errors.options && <span className="error-msg">{errors.options}</span>}
      </div>
    </div>
  );
};

export default QuestionForm;
