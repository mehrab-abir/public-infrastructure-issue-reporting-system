import React from "react";
import DashboardContainer from "../DashboardContainer";
import Counts from "./DashComponents/Counts";
import RecentIssues from "./DashComponents/RecentIssues";
import GroupIssuesStatus from "./DashComponents/GroupIssuesStatus";
import LatestStaffs from "./DashComponents/LatestStaffs";
import LatestCitizens from "./DashComponents/LatestCitizens";

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Counts></Counts>

      <GroupIssuesStatus></GroupIssuesStatus>

      <RecentIssues></RecentIssues>

      <div className="mt-5 flex flex-col lg:flex-row gap-5">
        <LatestStaffs></LatestStaffs>
        <LatestCitizens></LatestCitizens>
      </div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
