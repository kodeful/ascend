import { useEffect, type FC } from "react";
import { Route, useHistory, type RouteProps } from "react-router-dom";

import DefaultLayout from "components/layouts/DefaultLayout";
import { LayoutSplashScreen } from "components/providers/SplashScreenProvider";
import { useMeStore } from "components/stores/MeStore";
import type { WithChildren } from "utils/types";

interface PrivateRouteProps extends RouteProps {
  // requiredPermissions?: PermissionsType[];
  // requiredRole?: FilterPortalUsersDataRole[];
  layout?: ({ children }: WithChildren<unknown>) => any;
}

const PrivateRoute: FC<PrivateRouteProps> = ({
  // requiredPermissions = [],
  // requiredRole = [],
  layout: Layout = DefaultLayout,
  ...rest
}) => {
  const history = useHistory();

  const token = useMeStore((s) => s.token);
  const me = useMeStore((s) => s.me);

  // const { data: currentUserResponse } = usePortalUserControllerGetMePortalUser({
  //   query: {
  //     enabled: Boolean(token),
  //     onError: (err: AxiosError) => {
  //       if (err.response?.status === 404) {
  //         useMeStore.getState().logout();
  //       }
  //     },
  //   },
  // });

  // const currentUser = useMemo(
  //   () => currentUserResponse?.data,
  //   [currentUserResponse],
  // );

  useEffect(() => {
    if (!token) history.push("/sign-in");
  }, [token, history]);

  useEffect(() => {
    // if (!currentUser) return;
    // useMeStore.getState().setMe(currentUser);
  }, []);

  if (me) {
    // if (hasRole(requiredRole)) {
    return (
      <Layout>
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
