import React from 'react';
import {
  Route as ReactDOMRouter,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <>
      <ReactDOMRouter
        {...rest}
        render={({ location }) => {
          return isPrivate === Boolean(user) ? (
            <Component />
          ) : (
            <Redirect
              to={{
                pathname: isPrivate ? '/' : '/dashboard',
                state: { from: location },
              }}
            />
          );
        }}
      />
    </>
  );
};

export default Route;
