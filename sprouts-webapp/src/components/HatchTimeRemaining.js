import { useCallback, useEffect, useState } from "react";

let timer = null;
const HatchTimeRemaining = ({ unlockTimestamp, onReadyToHatch }) => {
  const [value, setValue] = useState(0);

  const calculateRemainingTime = useCallback(() => {
    const diff = Math.abs(new Date()
    - new Date(unlockTimestamp)) + 1000 * 60; // add an extra minute;
    const minutes = Math.floor((diff / 1000) / 60); // diff in minutes
    setValue(minutes);

    if (!minutes) if (onReadyToHatch) onReadyToHatch();
  }, [unlockTimestamp]);

  useEffect(() => {
    calculateRemainingTime();
      
    timer = setInterval(() => {
      calculateRemainingTime();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return value;
};

export default HatchTimeRemaining;
