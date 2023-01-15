import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Navigation from "components/Navigation";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Auth from "routes/Auth";

const Router = ({ isLoggedIn, userObj, refreshUser }) => {
  return (
    <HashRouter>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} refreshUser={refreshUser} />
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </HashRouter>
  );
};

export default Router;
