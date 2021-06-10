import React, { lazy, Suspense, useState, useEffect } from "react";
import { Route, Switch, Router, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Progress from "./components/Progress";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { createBrowserHistory } from "history";

const MarketingLazy = lazy(() => import("./components/MarketingApp"));
const Authlazy = lazy(() => import("./components/AuthApp"));
const Dashboardlazy = lazy(() => import("./components/DashboardApp"));

const generateClassName = createGenerateClassName({
  productionPrefix: "co",
});

const history = createBrowserHistory();

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      history.push("/dashboard");
    }
  }, [isSignedIn]);

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            onSignOut={() => setIsSignedIn(false)}
            isSignedIn={isSignedIn}
          />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path="/auth">
                <Authlazy onSignIn={() => setIsSignedIn(true)}></Authlazy>
              </Route>
              <Route path="/dashboard">
                {!isSignedIn && <Redirect to="/" />}
                <Dashboardlazy />
              </Route>
              <Route path="/" component={MarketingLazy} />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};
