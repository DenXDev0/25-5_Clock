import { useState, useEffect, useRef } from "react";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  const resetTimer = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const adjustLength = (type, delta) => {
    if (type === "break") {
      setBreakLength((prev) => Math.min(60, Math.max(1, prev + delta)));
    } else {
      setSessionLength((prev) => {
        const newLength = Math.min(60, Math.max(1, prev + delta));
        if (!isRunning) setTimeLeft(newLength * 60);
        return newLength;
      });
    }
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          if (audioRef.current) audioRef.current.play();

          if (timerLabel === "Session") {
            setTimerLabel("Break");
            return breakLength * 60;
          } else {
            setTimerLabel("Session");
            return sessionLength * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timerLabel, breakLength, sessionLength]);

  return (
    <div className="App">
      <div className="display-timer">
          <h1>25 + 5 Clock</h1>
          <h2 id="timer-label">{timerLabel}</h2>
          <div id="time-left">{formatTime(timeLeft)}</div>
          <div className="setting-display">
            <span id="break-length">{breakLength}</span>
            <span id="session-length">{sessionLength}</span>
          </div>
      </div>
      <div className="settings">
        <div>
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => adjustLength("break", -1)}>-</button>

          <button id="break-increment" onClick={() => adjustLength("break", 1)}>+</button>
        </div>
        <div>
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={() => adjustLength("session", -1)}>-</button>
          <button id="session-increment" onClick={() => adjustLength("session", 1)}>+</button>
        </div>
      </div>
      <div className="button-container">
        <button id="start_stop" onClick={toggleTimer}>{isRunning ? "STOP" : "START"}</button>
        <button id="reset" onClick={resetTimer}>RESET</button>
      </div>
      <audio id="beep" ref={audioRef} src="https://bigsoundbank.com/UPLOAD/wav/0173.wav"></audio>
    </div>
  );
};

export default App;
