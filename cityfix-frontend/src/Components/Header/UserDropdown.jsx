import React from 'react';
import { Link } from 'react-router';

const UserDropdown = () => {
    return (
        <div className='flex items-center gap-4'>
            <Link to='/auth/signin' className='btn btn-sm border border-blue-500 text-primary'>Sign In</Link>
            <Link to='/auth/register' className='btn btn-sm border-none bg-primary text-white'>Sign Up</Link>
        </div>
    );
};

export default UserDropdown;