import { useEffect, useMemo, type FC } from "react";
import type { AxiosError } from "axios";
import { Route, useHistory, type RouteProps } from "react-router-dom";

import { useUserControllerMe } from "api/generated/user/user";
import DefaultLayout from "components/layouts/DefaultLayout";
import { LayoutSplashScreen } from "components/providers/SplashScreenProvider";
import { useMeStore } from "components/stores/MeStore";
import type { WithChildren } from "utils/types";

interface PrivateRouteProps extends RouteProps {
  shrinked?: boolean;
  // requiredPermissions?: PermissionsType[];
  // requiredRole?: FilterPortalUsersDataRole[];
  layout?: ({ children }: WithChildren<unknown>) => any;
}

const PrivateRoute: FC<PrivateRouteProps> = ({
  shrinked = false,
  // requiredPermissions = [],
  // requiredRole = [],
  layout: Layout = DefaultLayout,
  ...rest
}) => {
  const history = useHistory();

  const token = useMeStore((s) => s.token);
  const me = useMeStore((s) => s.me);

  const { data: currentUserResponse } = useUserControllerMe({
    query: {
      queryKey: ["me"],
      enabled: Boolean(token),
      onError: (err: AxiosError) => {
        if (err.response?.status === 404) {
          useMeStore.getState().reset();
          history.push("/sign-in");
        }
      },
    },
  });

  const currentUser = useMemo(
    () => currentUserResponse?.data,
    [currentUserResponse?.data],
  );

  useEffect(() => {
    if (!token) history.push("/sign-in");
  }, [token, history]);

  useEffect(() => {
    if (!currentUser) return;
    useMeStore.getState().setMe(currentUser);
  }, [currentUser]);

  if (me) {
    // if (hasRole(requiredRole)) {
    return (
      <Layout shrinked={shrinked}>
        <Route {...rest} />
      </Layout>
    );
    // } else {
    //   return <Box>{"You don't have access to this page"}</Box>;
    // }
  }

  return <LayoutSplashScreen />;
};

export default PrivateRoute;
