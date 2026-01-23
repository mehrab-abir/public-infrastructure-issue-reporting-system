import React from "react";
import DashboardContainer from "../DashboardContainer";
import Counts from "./DashComponents/Counts";
import RecentIssues from "./DashComponents/RecentIssues";
import GroupIssuesStatus from "./DashComponents/GroupIssuesStatus";

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Counts></Counts>

      <GroupIssuesStatus></GroupIssuesStatus>

      <RecentIssues></RecentIssues>

    </DashboardContainer>
  );
};

export default AdminDashboard;
