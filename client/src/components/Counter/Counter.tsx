import React, { useEffect, useState, type FC } from "react";
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

  useEffect(() => {
    const totalSteps = Math.ceil(count / step); // Calculate the total steps needed
    const intervalTime = duration / totalSteps; // Calculate the interval time for each step

    const interval = setInterval(() => {
      setCurrentCount((prev) => {
        const nextNumber = prev + step;
        if (nextNumber >= count) {
          clearInterval(interval);
          return count;
        }

        return parseFloat(nextNumber.toFixed(1));
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [count, duration, step]);

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
