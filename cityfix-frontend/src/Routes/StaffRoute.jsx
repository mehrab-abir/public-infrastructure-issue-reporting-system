import React from "react";
import useRole from "../Hooks/Role/useRole";
import LoaderSpinner from "../Components/LoaderSpinner";
import ForbiddenRoute from "../Pages/ForbiddenRoute";

const StaffRoute = ({ children }) => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <LoaderSpinner></LoaderSpinner>;
  }

  if (role !== "staff") {
    return <ForbiddenRoute></ForbiddenRoute>;
  }
  return children;
};

export default StaffRoute;
