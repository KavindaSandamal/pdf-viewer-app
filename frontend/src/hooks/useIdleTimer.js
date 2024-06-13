import React, { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

function useIdle({ onIdle, idleTime }) {
  const [isIdle, setIsIdle] = useState(false);
  
  const handleOnIdle = (event) => {
    setIsIdle(true); 
    onIdle(); 
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * idleTime,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  const handleOnActive = () => {
    setIsIdle(false);
  };

  useIdleTimer({ onActive: handleOnActive });

  return {
    getRemainingTime,
    getLastActiveTime,
    isIdle
  };
}

export default useIdle;
