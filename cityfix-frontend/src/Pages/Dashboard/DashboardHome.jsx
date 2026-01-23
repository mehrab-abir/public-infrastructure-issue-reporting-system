import React from "react";
import DashboardContainer from "./DashboardContainer";
import useRole from "../../Hooks/Role/useRole";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import CitizenDashboard from "./CitizenDashboard/CitizenDashboard";
import StaffDashboard from "./StaffDashboard.jsx/StaffDashboard";
import LoaderSpinner from "../../Components/LoaderSpinner";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <LoaderSpinner></LoaderSpinner>
      </div>
    );
  }

  if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "citizen") {
    return <CitizenDashboard></CitizenDashboard>;
  } else {
    return <StaffDashboard></StaffDashboard>;
  }
};

export default DashboardHome;
