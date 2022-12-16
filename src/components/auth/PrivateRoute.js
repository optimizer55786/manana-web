import React, { useGlobal } from "reactn";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user] = useGlobal("user");

  const getComponent = (props) => {
    if (!user) {
      return (
        <Redirect
          to={{ pathname: "/sign-in", state: { from: props.location } }}
        />
      );
    } else if (user && user.verificationRequired) {
      return (
        <Redirect
          to={{ pathname: "/sign-in/verify", state: { from: props.location } }}
        />
      );
    } else {
      return <Component {...props} />;
    }
  };

  return <Route {...rest} render={(props) => getComponent(props)} />;
};

export default PrivateRoute;
