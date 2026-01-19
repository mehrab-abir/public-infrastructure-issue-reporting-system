import React from "react";
import useAuth from "../Hooks/Auth/useAuth";
import LoaderSpinner from "../Components/LoaderSpinner";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex items-center justify-center mt-10">
            <LoaderSpinner></LoaderSpinner>;
        </div>
    )
    
  }

  if (user) {
    return children;
  } else {
    return <Navigate to="/auth/signin" state={location.pathname} replace />;
  }
};

export default PrivateRoute;
