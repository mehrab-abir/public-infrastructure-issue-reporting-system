import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer';
import Container from '../Components/Container';
import { Link } from 'react-router';
import { IoWarningOutline } from "react-icons/io5";

const ForbiddenRoute = () => {
    return (
        <>
        <title>Forbidden Page</title>
        <Container>
            <div className='flex flex-col items-center justify-center py-36 lg:ml-10'>
                <h2 className="text-3xl tetx-center font-bold flex items-center gap-2 text-red-500">Unauthorized Access <IoWarningOutline /></h2>
                <Link to='/' className='btn bg-primary text-white mt-6'>Go to Home Page</Link>
            </div>
        </Container>
        <Footer></Footer>
        </>
        
    );
};

export default ForbiddenRoute;