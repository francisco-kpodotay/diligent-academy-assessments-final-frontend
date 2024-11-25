import { Story } from "@/types";
import { Box, Button, Stack, Typography } from "@mui/material";
import Countdown, { CountdownApi, zeroPad } from "react-countdown";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface RenderTypes {
  minutes: number;
  seconds: number;
  completed: boolean;
}

interface TimerProps {
  story: Story | null;
  setRun: (boolean: boolean) => void;
}

const INITIAL_TIME = 60 * 100;

const Timer: React.FC<TimerProps> = ({ story, setRun }) => {
  const countdownApi = useRef<CountdownApi | null>(null);
  const [countdownTime, setCountdownTime] = useState(Date.now() + INITIAL_TIME);
  const [btnText, setBtnText] = useState<"Start" | "Stop">("Start");

  function resetTimer() {
    countdownApi.current && countdownApi.current.pause();
    setRun(false);
    setCountdownTime(Date.now() + INITIAL_TIME);
    setBtnText("Start");
  }

  function displayTime(minutes: number, seconds: number) {
    return (
      <Typography>
        Timer: {zeroPad(minutes)}:{zeroPad(seconds)}
      </Typography>
    );
  }

  function renderer({ minutes, seconds, completed }: RenderTypes) {
    if (completed) {
      resetTimer();
    }
    return displayTime(minutes, seconds);
  }

  const handleStartStopClick = useCallback(() => {
    if (btnText === "Start") {
      countdownApi.current && countdownApi.current.start();
      setRun(true);
    }
    if (btnText === "Stop") {
      countdownApi.current && countdownApi.current.pause();
      setRun(false);
    }
    setBtnText((prev) => (prev === "Start" ? "Stop" : "Start"));
  }, [btnText]);

  const setRef = useCallback((countdown: Countdown | null) => {
    if (countdown) {
      countdownApi.current = countdown.getApi();
    }
  }, []);

  useEffect(() => {
    resetTimer();
  }, [story]);

  return (
    <Box>
      <Countdown
        date={countdownTime}
        renderer={renderer}
        autoStart={false}
        ref={setRef}
      />

      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
          onClick={handleStartStopClick}
          disabled={story === null ? true : false}
        >
          {btnText}
        </Button>
        <Button variant="outlined">Show results</Button>
      </Stack>
    </Box>
  );
};

export default Timer;
