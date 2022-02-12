import { useEffect, useState } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [voiceTimerId, setVoiceTimerId] = useState<number>();

  const startTimer = () => {
    setVoiceTimerId(
      setInterval(() => {
        setTime((time) => (time += 1));
      }, 1000) as unknown as number
    );
  };

  const stopTimer = () => {
    setTime(0);
    setVoiceTimerId(undefined);
    clearInterval(voiceTimerId);
  };

  return { time, startTimer, stopTimer };
};
