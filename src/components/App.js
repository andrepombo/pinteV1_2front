import React, { useMemo } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// Components
import Layout from "./Layout";

// Pages
import Error from "../pages/error";
import Login from "../pages/login";

// Context
import { useUserState } from "../context/UserContext";

export default function App() {
  const { isAuthenticated } = useUserState();
  const authStatus = useMemo(() => isAuthenticated, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <Route exact path="/app" render={() => <Redirect to="/app/dashboard" />} />
        <PrivateRoute path="/app" component={Layout} isAuthenticated={authStatus} />
        <PublicRoute path="/login" component={Login} isAuthenticated={authStatus} />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
}

// ✅ PrivateRoute (For Authenticated Users)
const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    }
  />
);

// ✅ PublicRoute (For Unauthenticated Users)
const PublicRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);
