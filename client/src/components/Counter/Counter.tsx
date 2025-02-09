import React, { type FC } from "react";
import { Typography, type TypographyProps } from "@mui/material";
import CountUp from "react-countup";

type CounterProps = TypographyProps & {
  count: number;
  duration?: number;
  step?: number;
  digits?: number;
};

const Counter: FC<CounterProps> = ({
  count,
  duration = 1_000,
  // step = 0.1,
  digits = 1,
  ...rest
}) => {
  return (
    <Typography
      display="inline-block"
      fontSize="inherit"
      fontWeight="inherit"
      color="inherit"
      {...rest}
    >
      <CountUp
        end={count}
        duration={duration / 1_000}
        decimals={digits}
        preserveValue
      />
    </Typography>
  );
};

export default Counter;
