import React from "react";
import DashboardContainer from "../DashboardContainer";
import IssueCountByStatus from "./CitizenDashComponents/IssueCountByStatus";
import LatestReportedIssues from "./CitizenDashComponents/LatestReportedIssues";

const CitizenDashboard = () => {
  
  return (
    <DashboardContainer>
      <IssueCountByStatus></IssueCountByStatus>
      <LatestReportedIssues></LatestReportedIssues>
    </DashboardContainer>
  );
};

export default CitizenDashboard;
