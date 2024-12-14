import React, { useEffect, useMemo, useState, type FC } from "react";
import { Typography, type TypographyProps } from "@mui/material";

type CounterProps = TypographyProps & {
  count: number;
  duration?: number;
  step?: number;
  digits?: number;
};

const Counter: FC<CounterProps> = ({
  count,
  duration = 1_000,
  step = 0.1,
  digits = 1,
  ...rest
}) => {
  const [currentCount, setCurrentCount] = useState<number>(0);
  const isNegative = useMemo(() => count < currentCount, [count, currentCount]);

  useEffect(() => {
    let totalSteps = Math.ceil(count / step);
    totalSteps = Math.min(totalSteps, duration / 10);
    const intervalTime = duration / totalSteps;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    step = count / totalSteps || 1;

    const interval = setInterval(() => {
      setCurrentCount((prev) => {
        let nextNumber = prev;
        switch (isNegative) {
          case true:
            nextNumber -= step;
            if (nextNumber <= count) {
              clearInterval(interval);
              return count;
            }
            break;
          case false:
            nextNumber += step;
            if (nextNumber >= count) {
              clearInterval(interval);
              return count;
            }
            break;
        }

        return parseFloat(nextNumber.toFixed(1));
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [count, duration, step, isNegative]);

  return (
    <Typography
      display="inline-block"
      fontSize="inherit"
      fontWeight="inherit"
      color="inherit"
      {...rest}
    >
      {currentCount.toLocaleString("en-US", {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      })}
    </Typography>
  );
};

export default Counter;
