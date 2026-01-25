import React from 'react';
import DashboardContainer from '../DashboardContainer';
import LatestResolvedIssues from './StaffDashComponents/LatestResolvedIssues';
import IssuesbyStatus from './StaffDashComponents/IssuesbyStatus';

const StaffDashboard = () => {
    return (
      <DashboardContainer>
        <div className='flex items-center justify-center'>
          <IssuesbyStatus/>
        </div>
        
        <LatestResolvedIssues />
      </DashboardContainer>
    );
};

export default StaffDashboard;