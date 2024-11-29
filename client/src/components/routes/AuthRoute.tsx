import React, { type FC } from "react";
import {
  Redirect,
  Route,
  useLocation,
  type RouteProps,
} from "react-router-dom";

import { LayoutSplashScreen } from "components/providers/SplashScreenProvider";
import { useMeStore } from "components/stores/MeStore";

const AuthRoute: FC<RouteProps> = (props) => {
  const isAuthenticated = useMeStore((s) => !!s.token);
  const location = useLocation<{ unauthorized401?: boolean }>();

  if (isAuthenticated) {
    if (location.state?.unauthorized401) {
      // logout({ returnTo: `${window.location.origin}/login` });
      return <LayoutSplashScreen />;
    }

    if (location.pathname === "/sign-in") {
      return <Redirect to="/" />;
    }
  }

  return <Route {...props} />;
};

export default AuthRoute;
