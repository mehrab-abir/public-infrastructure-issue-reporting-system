import React from 'react';
import Banner from './Banner';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import GetStartedSection from './GetStartedSection';
import WhyChoose from './WhyChoose';
import LatestResolvedIssues from './LatestResolvedIssues';
import Disclaimer from './Disclaimer';

const Home = () => {
    return (
        <>
            <Banner></Banner>
            <Stats></Stats>
            <LatestResolvedIssues></LatestResolvedIssues>
            <Features></Features>
            <HowItWorks></HowItWorks>
            <GetStartedSection></GetStartedSection>
            <Disclaimer></Disclaimer>
            <WhyChoose></WhyChoose>
        </>
    );
};

export default Home;