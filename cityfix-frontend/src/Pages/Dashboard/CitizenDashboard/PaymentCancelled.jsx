import React from 'react';
import DashboardContainer from '../DashboardContainer';

const PaymentCancelled = () => {
    return (
      <DashboardContainer>
        <div>
          <h1 className="text-center text-red-600 text-xl my-2">
            Payment Cancelled. Please Try again
          </h1>
          <Link
            to="/dashboard/my-issues"
            className="mb-5 text-white btn bg-accent mt-2"
          >
            Go back to My Issues page
          </Link>
        </div>
      </DashboardContainer>
    );
};

export default PaymentCancelled;