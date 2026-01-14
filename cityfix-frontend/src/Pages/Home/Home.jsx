import React from 'react';
import Banner from './Banner';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import GetStartedSection from './GetStartedSection';

const Home = () => {
    return (
        <>
            <Banner></Banner>
            <Stats></Stats>
            <Features></Features>
            <HowItWorks></HowItWorks>
            <GetStartedSection></GetStartedSection>
        </>
    );
};

export default Home;