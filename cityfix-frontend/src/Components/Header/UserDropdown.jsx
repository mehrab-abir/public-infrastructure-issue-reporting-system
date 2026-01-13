import React from 'react';

const UserDropdown = () => {
    return (
        <div className='flex items-center gap-4'>
            <button className='btn btn-sm border border-blue-500 text-primary'>Log In</button>
            <button className='btn btn-sm border-none bg-primary text-white'>Sign Up</button>
        </div>
    );
};

export default UserDropdown;