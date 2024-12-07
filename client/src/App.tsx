import React from "react";
import { createBrowserHistory } from "history";
import ChatAiPage from "pages/chat-ai/ChatAiPage";
import DataPage from "pages/data/DataPage";
import HomePage from "pages/home/HomePage";
import LearnerDetailsPage from "pages/learner/details/LearnerDetailsPage";
import CreateReportPage from "pages/report/create/CreateReportPage";
import ReportPage from "pages/report/ReportPage";
// import ResetPasswordPage from "pages/reset-password/ResetPasswordPage";
import SettingsAccountPage from "pages/settings/account/SettingsAccountPage";
import SettingsConnectionsFilesPage from "pages/settings/connections/files/SettingsConnectionsFIlesPage";
import SettingsConnectionsPage from "pages/settings/connections/SettingsConnectionsPage";
import SettingsGroupSettingsPage from "pages/settings/group-settings/SettingsGroupSettingsPage";
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
        {/* <AuthRoute exact component={ResetPasswordPage} path="/reset-password" /> */}

        {/* CONTROLLERS */}
        <PrivateRoute exact component={HomePage} path="/home" />
        <PrivateRoute exact component={DataPage} path="/data" />
        <PrivateRoute exact component={ReportPage} path="/report" />
        <PrivateRoute
          exact
          component={CreateReportPage}
          path="/report/create"
          shrinked
        />
        <PrivateRoute exact component={ChatAiPage} path="/chat-ai" />

        <PrivateRoute
          exact
          component={LearnerDetailsPage}
          path="/learner/:learnerId"
        />

        <PrivateRoute
          exact
          component={SettingsAccountPage}
          path="/settings/account"
          shrinked
        />
        <PrivateRoute
          exact
          component={SettingsGroupSettingsPage}
          path="/settings/group-settings"
          shrinked
        />
        <PrivateRoute
          exact
          component={SettingsConnectionsPage}
          path="/settings/connections"
          shrinked
        />
        <PrivateRoute
          exact
          component={SettingsConnectionsFilesPage}
          path="/settings/connections/files"
          shrinked
        />

        {/* <PrivateRoute
          exact
          component={SettingsPage}
          path="/settings/notification-settings"
        /> */}
        {/* <PrivateRoute exact component={SettingsPage} path="/settings/support" /> */}

        {/* REDIRECT */}
        <Redirect from="/settings" to="/settings/account" />
        <Redirect to="/home" />
      </Switch>
    </Providers>
  );
};

export default App;
