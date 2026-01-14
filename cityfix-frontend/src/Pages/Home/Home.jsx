import React from 'react';
import Banner from './Banner';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';

const Home = () => {
    return (
        <>
            <Banner></Banner>
            <Stats></Stats>
            <Features></Features>
            <HowItWorks></HowItWorks>
        </>
    );
};

export default Home;