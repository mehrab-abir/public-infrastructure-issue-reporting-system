import React from "react";
import DashboardContainer from "../DashboardContainer";
import IssueCountByStatus from "./CitizenDashComponents/IssueCountByStatus";
import LatestReportedIssues from "./CitizenDashComponents/LatestReportedIssues";
import LatestPayments from "./CitizenDashComponents/LatestPayments";

const CitizenDashboard = () => {
  
  return (
    <DashboardContainer>
      <IssueCountByStatus></IssueCountByStatus>
      <LatestReportedIssues></LatestReportedIssues>
      <LatestPayments></LatestPayments>
    </DashboardContainer>
  );
};

export default CitizenDashboard;
