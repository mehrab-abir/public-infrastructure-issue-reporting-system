import React from 'react';
import Banner from './Banner';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import GetStartedSection from './GetStartedSection';
import WhyChoose from './WhyChoose';
import LatestResolvedIssues from './LatestResolvedIssues';
import Disclaimer from '../../Components/Disclaimer';

const Home = () => {
    return (
        <>
        <title>CityFix - Home</title>
            <Banner></Banner>
            <Stats></Stats>
            <LatestResolvedIssues></LatestResolvedIssues>
            <Features></Features>
            <HowItWorks></HowItWorks>
            <GetStartedSection></GetStartedSection>
            <WhyChoose></WhyChoose>
            <Disclaimer></Disclaimer>
        </>
    );
};

export default Home;