import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizzes } from "../../hooks/useQuizzes";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import QuestionForm from "../../components/QuestionForm";
import "./style.scss";

const QuizCreate = () => {
  const navigate = useNavigate();
  const { addQuiz } = useQuizzes();
  const [step, setStep] = useState(1); //multi-step-wizard
  const [errors, setErrors] = useState({});

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    timeLimit: 10, // minutes
    questions: [],
  });

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep1 = () => {
    //form validation
    const newErrors = {};
    if (!quizData.title.trim()) newErrors.title = "Title is required";
    if (!quizData.description.trim())
      newErrors.description = "Description is required";
    if (quizData.timeLimit < 1)
      newErrors.timeLimit = "Time limit must be at least 1 minute";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    //form validation
    const newErrors = {};
    if (quizData.questions.length === 0) {
      newErrors.general = "Add at least one question";
    }

    quizData.questions.forEach((q, index) => {
      if (!q.questionText.trim()) {
        newErrors[`q${index}_questionText`] = "Question text is required";
      }
      if (q.options.length < 2) {
        newErrors[`q${index}_options`] = "At least 2 options required";
      }
      const hasCorrect = q.options.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        newErrors[`q${index}_options`] = "Select at least one correct option";
      }
      q.options.forEach((opt, optIndex) => {
        if (!opt.text.trim()) {
          newErrors[`q${index}_option${optIndex}`] = "Option text required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    }
  };

  const handleBack = () => {
    //multi-step-wizard
    setStep(1);
  };

  const handleAddQuestion = () => {
    //add-delete-update-question
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          questionText: "",
          type: "single", // single or multiple
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    }));
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    //add-delete-update-question
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = updatedQuestion;
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleDeleteQuestion = (index) => {
    //add-delete-update-question
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      addQuiz(quizData);
      navigate("/");
    }
  };

  return (
    <div className="quiz-create-page">
      <h1>Create a New Quiz</h1>

      <div className="wizard-progress">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1. Quiz Info</div>
        <div className="line"></div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2. Questions</div>
      </div>

      <div className={`wizard-content step-${step}`}>
        {" "}
        //multi-step-wizard
        {step === 1 && (
          <div className="step-content fade-in">
            <Input
              label="Quiz Title"
              name="title"
              value={quizData.title}
              onChange={handleInfoChange}
              placeholder="e.g. React Basics"
              error={errors.title}
              required
            />
            <Input
              label="Description"
              name="description"
              value={quizData.description}
              onChange={handleInfoChange}
              placeholder="Short description..."
              error={errors.description}
              required
            />
            <Input
              label="Time Limit (minutes)"
              name="timeLimit"
              type="number"
              value={quizData.timeLimit}
              onChange={handleInfoChange}
              min="1"
              error={errors.timeLimit}
              required
            />
            <div className="actions">
              <Button onClick={handleNext}>Next Step &rarr;</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="step-content fade-in">
            {quizData.questions.length === 0 && (
              <div className="empty-state">
                <p>No questions added yet.</p>
              </div>
            )}

            {quizData.questions.map((q, index) => (
              <QuestionForm
                key={q.id}
                index={index}
                question={q}
                onChange={handleQuestionChange}
                onDelete={handleDeleteQuestion}
                errors={{
                  questionText: errors[`q${index}_questionText`],
                  options: errors[`q${index}_options`],
                  ...Object.keys(errors).reduce((acc, key) => {
                    if (key.startsWith(`q${index}_option`)) {
                      acc[key.replace(`q${index}_`, "")] = errors[key];
                    }
                    return acc;
                  }, {}),
                }}
              />
            ))}

            {errors.general && (
              <div className="error-banner">{errors.general}</div>
            )}

            <div className="actions-bar">
              <Button variant="outline" onClick={handleAddQuestion}>
                + Add Question
              </Button>
              <div className="nav-buttons">
                <Button variant="secondary" onClick={handleBack}>
                  &larr; Back
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                  Finish Creating Quiz
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCreate;
