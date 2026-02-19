import { createContext, useState, useEffect, useCallback } from "react";

export const QuizContext = createContext();

const STORAGE_KEY = "quiz-app-data";

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // load data
  useEffect(() => {
    const storedQuizzes = localStorage.getItem(STORAGE_KEY);
    if (storedQuizzes) {
      try {
        setQuizzes(JSON.parse(storedQuizzes));
      } catch (error) {
        console.error("Failed to parse quizzes:", error);
        setQuizzes([]);
      }
    }
    setLoading(false);
  }, []); // init

  // save data
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
  }, [quizzes, loading]);

  const addQuiz = useCallback((quiz) => {
    const newQuiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [...prev, newQuiz]);
    return newQuiz.id;
  }, []);

  const deleteQuiz = useCallback((id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  // get quiz
  const getQuiz = useCallback(
    (id) => {
      return quizzes.find((q) => q.id === id);
    },
    [quizzes],
  );

  const value = {
    quizzes,
    loading,
    addQuiz,
    deleteQuiz,
    getQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
