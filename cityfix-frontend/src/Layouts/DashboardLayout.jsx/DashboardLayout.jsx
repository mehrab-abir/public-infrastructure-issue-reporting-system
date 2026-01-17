import React from 'react';
import Footer from '../../Components/Footer';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
    return (
        <div className='bg-base'>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default DashboardLayout;