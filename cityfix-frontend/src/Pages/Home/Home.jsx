import React from 'react';
import Banner from './Banner';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import GetStartedSection from './GetStartedSection';
import WhyChoose from './WhyChoose';

const Home = () => {
    return (
        <>
            <Banner></Banner>
            <Stats></Stats>
            <Features></Features>
            <HowItWorks></HowItWorks>
            <GetStartedSection></GetStartedSection>
            <WhyChoose></WhyChoose>
        </>
    );
};

export default Home;