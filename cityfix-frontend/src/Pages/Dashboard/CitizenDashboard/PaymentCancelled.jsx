import React from 'react';
import DashboardContainer from '../DashboardContainer';
import { Link } from 'react-router';

const PaymentCancelled = () => {
    return (
      <DashboardContainer>
        <div className='flex flex-col items-center justify-center h-[60vh]'>
          <h1 className="text-center text-red-600 text-xl my-2">
            Payment Cancelled. Please Try again
          </h1>
          <Link
            to="/dashboard/my-issues"
            className="mb-5 text-white btn bg-gray-700  mt-2"
          >
            Go back to My Issues page
          </Link>
        </div>
      </DashboardContainer>
    );
};

export default PaymentCancelled;