import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer';
import Container from '../Components/Container';
import { Link } from 'react-router';

const ForbiddenRoute = () => {
    return (
        <>
        <Header></Header>
        <Container>
            <div className='flex flex-col items-center justify-center'>
                <h2 className="text 3xl tetx-center font-bold text-red-500">Forbidden Accees</h2>
                <Link to='/' className='btn bg-primary text-white mt-6'>Go to Home Page</Link>
            </div>
        </Container>
        <Footer></Footer>
        </>
        
    );
};

export default ForbiddenRoute;