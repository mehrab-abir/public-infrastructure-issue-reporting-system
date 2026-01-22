import React from 'react';
import { Link } from 'react-router';


const ErrorPage = () => {
    return (

          <div className='flex flex-col items-center justify-center mt-20'>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-500">Error 404 : Page Not Found</h1>
            <p className='text-center my-6'>The Page You Are Looking For Is Not Available</p>
            <Link to="/" className="btn bg-gray-700 text-white mt-4">
            Back To Home
          </Link>
          </div>
    );
};

export default ErrorPage;