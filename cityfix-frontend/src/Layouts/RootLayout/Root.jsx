import React from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer';
import { Outlet } from 'react-router';

const Root = () => {
    return (
        <div className='bg-base'>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;