import React from 'react';
import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
    return (
      <button className="btn w-full bg-primary-soft cursor-pointer border-none">
        <FcGoogle className='text-xl' />
        Sign In With Google
      </button>
    );
};

export default GoogleSignIn;