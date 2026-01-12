import React from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer';
import { Outlet } from 'react-router';

const Root = () => {
    return (
        <>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    );
};

export default Root;