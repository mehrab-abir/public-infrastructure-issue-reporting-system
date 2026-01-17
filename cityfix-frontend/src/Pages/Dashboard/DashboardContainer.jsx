import React from 'react';

const DashboardContainer = ({children}) => {
    return (
      <div className="w-11/12 xl:w-5/7 lg:w-4/6 lg:ml-75 pl-3 xl:px-3">
        {children}
      </div>
    );
};

export default DashboardContainer;