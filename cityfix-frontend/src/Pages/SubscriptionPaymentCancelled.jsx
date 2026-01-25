import React from 'react';
import Container from '../Components/Container';

const SubscriptionPaymentCancelled = () => {
    return (
      <div className='bg-base py-36'>
        <Container>
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h1 className="text-center text-red-600 text-xl my-2">
              Payment Cancelled. Please Try again
            </h1>
            <Link
              to="/"
              className="mb-5 text-white btn bg-gray-700  mt-2"
            >
              Go back to Home Page
            </Link>
          </div>
        </Container>
      </div>
    );
};

export default SubscriptionPaymentCancelled;