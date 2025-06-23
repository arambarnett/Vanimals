import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import isAfter from "date-fns/isAfter";

const Countdown = (props, ref) => {
  const {
    to,
    from,
    stop,
    onTick,
    onTimeUp,
    renderTime,
  } = props;
  const [initRef, setInitRef] = useState(from); // wacky solution
  const [timeRef, setTimeRef] = useState(null);
  const [timeup, setTimeup] = useState(false);
  const counter = useRef(null);
  
  const timeLeft = useMemo(() => {
    const diff = new Date(to) - new Date(timeRef);
    return Math.max(diff, 0);
  }, [timeRef]);

  const progress = useMemo(() => {
    const period = (new Date(to) - new Date(initRef)) / 1000;
    const elapsed = period - Math.round(timeLeft / 1000);
    const percentage = (elapsed * 100) / period;
    return Number.isNaN(percentage) ? 100 : percentage;
  }, [initRef, timeLeft]);
  
  useImperativeHandle(ref, () => ({
    getCurrentTimeLeft: () => timeLeft,
  }));
  
  const subOneSecond = () => setTimeout(() => {
    const now = new Date();
    if (onTick) onTick({ timeLeft, progress });
    setTimeRef(now);
    if (isAfter(now, new Date(to))) {
      setTimeup(true);
    } else if (!stop) {
      counter.current = subOneSecond();
    }
  }, 1000);

  useEffect(() => {
    if (timeup && onTimeUp) onTimeUp();
  }, [timeup]);

  useEffect(() => {
    clearTimeout(counter.current);
    if (!stop) {
      const now = new Date();
      setTimeup(false);
      setInitRef(from || now);
      setTimeRef(now);
      counter.current = subOneSecond();
    }
    return () => clearTimeout(counter.current);
  }, [to, stop]);

  return renderTime({ timeLeft, progress });
};

export default forwardRef(Countdown);
