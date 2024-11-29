import React from "react";
import { createBrowserHistory } from "history";
import ChatAiPage from "pages/chat-ai/ChatAiPage";
import DataPage from "pages/data/DataPage";
import HomePage from "pages/home/HomePage";
import ReportPage from "pages/report/ReportPage";
import ResetPasswordPage from "pages/reset-password/ResetPasswordPage";
import SettingsAccountPage from "pages/settings/account/SettingsAccountPage";
import SettingsGroupSettingsPage from "pages/settings/group-settings/SettingsGroupSettingsPage";
import SettingsPage from "pages/settings/SettingsPage";
import SignInPage from "pages/sign-in/SignInPage";
import { Redirect, Switch } from "react-router-dom";

import PrivateRoute from "components/routes/PrivateRoute";

import AuthRoute from "./components/routes/AuthRoute";
import Providers from "./Providers";

export const history = createBrowserHistory();

const App = () => {
  return (
    <Providers history={history}>
      <Switch>
        <AuthRoute exact component={SignInPage} path="/sign-in" />
        <AuthRoute exact component={ResetPasswordPage} path="/reset-password" />

        {/* CONTROLLERS */}
        <PrivateRoute exact component={HomePage} path="/home" />
        <PrivateRoute exact component={DataPage} path="/data" />
        <PrivateRoute exact component={ReportPage} path="/report" />
        <PrivateRoute exact component={ChatAiPage} path="/chat-ai" />

        <PrivateRoute
          exact
          component={SettingsAccountPage}
          path="/settings/account"
        />
        <PrivateRoute
          exact
          component={SettingsGroupSettingsPage}
          path="/settings/group-settings"
        />
        <PrivateRoute
          exact
          component={SettingsPage}
          path="/settings/connections"
        />
        <PrivateRoute
          exact
          component={SettingsPage}
          path="/settings/notification-settings"
        />
        <PrivateRoute exact component={SettingsPage} path="/settings/support" />

        {/* REDIRECT */}
        <Redirect from="/settings" to="/settings/account" />
        <Redirect to="/home" />
      </Switch>
    </Providers>
  );
};

export default App;
