import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

/*
  Refactored to use the Global QuizContext.
  This allows state to be shared across the entire app,
  so updates in one component reflect everywhere immediately.
*/
export const useQuizzes = () => {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuizzes must be used within a QuizProvider");
  }

  return context;
};
