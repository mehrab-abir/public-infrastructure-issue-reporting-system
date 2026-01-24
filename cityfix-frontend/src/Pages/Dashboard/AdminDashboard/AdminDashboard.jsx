import React from "react";
import DashboardContainer from "../DashboardContainer";
import Counts from "./DashComponents/Counts";
import RecentIssues from "./DashComponents/RecentIssues";
import GroupIssuesStatus from "./DashComponents/GroupIssuesStatus";
import LatestStaffs from "./DashComponents/LatestStaffs";
import LatestCitizens from "./DashComponents/LatestCitizens";
import IssueStatusPieChart from "./DashComponents/IssueStatusPieChart";
import IssuesByMonthsBarChart from "./DashComponents/IssuesByMonthsBarChart";

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Counts></Counts>

      <GroupIssuesStatus></GroupIssuesStatus>

      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <IssueStatusPieChart></IssueStatusPieChart>

        <IssuesByMonthsBarChart></IssuesByMonthsBarChart>
      </div>

      <RecentIssues></RecentIssues>

      <div className="mt-5 flex flex-col lg:flex-row gap-5">
        <LatestStaffs></LatestStaffs>
        <LatestCitizens></LatestCitizens>
      </div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
