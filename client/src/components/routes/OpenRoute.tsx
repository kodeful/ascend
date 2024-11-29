import type { FC } from "react";
import { Route, type RouteProps } from "react-router-dom";

const OpenRoute: FC<RouteProps> = (props) => {
  return <Route {...props} />;
};

export default OpenRoute;
