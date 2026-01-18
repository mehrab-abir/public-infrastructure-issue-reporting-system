import React from 'react';

const DashboardContainer = ({children}) => {
    return (
      <div className="w-11/12 lg:w-2/3 xl:w-3/4 lg:ml-75 px-3 pt-5 pb-20 ml-10">
        {children}
      </div>
    );
};

export default DashboardContainer;