import React from "react";
import { createBrowserHistory } from "history";
import ChatAiPage from "pages/chat-ai/ChatAiPage";
import DataPage from "pages/data/DataPage";
import LearnerDetailsPage from "pages/data/learner/details/LearnerDetailsPage";
import ROICalculatorPage from "pages/data/roi-calculator/ROICalculatorPage";
import HomePage from "pages/home/HomePage";
import CreateReportPage from "pages/report/create/CreateReportPage";
import ReportPage from "pages/report/ReportPage";
// import ResetPasswordPage from "pages/reset-password/ResetPasswordPage";
import SettingsAccountPage from "pages/settings/account/SettingsAccountPage";
import SettingsConnectionsFilesPage from "pages/settings/connections/files/SettingsConnectionsFilesPage";
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
        <PrivateRoute
          exact
          component={ROICalculatorPage}
          path="/data/roi-calculator"
        />
        <PrivateRoute
          exact
          component={LearnerDetailsPage}
          path="/data/learner/:learnerId"
        />
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
