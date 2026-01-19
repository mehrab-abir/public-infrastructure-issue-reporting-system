import React from "react";
import useRole from "../Hooks/Role/useRole";
import LoaderSpinner from "../Components/LoaderSpinner";
import ForbiddenRoute from "../Pages/ForbiddenRoute";

const CitizenRoute = ({ children }) => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <LoaderSpinner></LoaderSpinner>;
  }

  if (role !== "citizen") {
    return <ForbiddenRoute></ForbiddenRoute>;
  }
  return children;
};

export default CitizenRoute;
