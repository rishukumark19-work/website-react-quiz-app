import { useState, useEffect, useRef } from "react";

const useTimer = (initialMinutes, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const onTimeUpRef = useRef(onTimeUp);

  // Ensure callback is always fresh without restarting timer
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Start/Restart timer when initialMinutes changes
  useEffect(() => {
    if (!initialMinutes || initialMinutes <= 0) return;

    // Set initial seconds
    setTimeLeft(initialMinutes * 60);

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        // Build-in check: if we're at 1 second, next tick is 0, so stop.
        if (prev <= 1) {
          clearInterval(intervalId);
          if (onTimeUpRef.current) {
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or re-run
    return () => clearInterval(intervalId);
  }, [initialMinutes]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return { timeLeft, formatTime };
};

export default useTimer;
